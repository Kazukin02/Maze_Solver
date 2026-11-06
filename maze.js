
class Maze {

	constructor(x,y,w,h,bgcolor,cs){
		this.x = x
		this.y = y
		this.width = w
		this.height = h
		this.bgcolor = bgcolor
		this.cellsize = cs
		this.vert_cells_num = Math.floor(this.height/this.cellsize)
		this.hor_cells_num =  Math.floor(this.width/this.cellsize)
		this.data = [] // 2d array that tracks what is in each tile
		this.mesh = null // low poly corner points, built the first time we render
		this.centers = null // middle point of every cell (mountain peaks, trees, flags)
	}

	createEmptyMaze(){
		/**
		 * this method will create a 2d list or array that is this.width by this.height
		 * eg. if width =  3 and height = 2
		 * this.data = [[0,0,0],
		 * 							[0,0,0]]
		 */

		for (let i=0; i < this.vert_cells_num; i++){
			this.data.push([])
			for (let n=0; n<this.hor_cells_num; n++){
				this.data[i].push(1)
			}
		}
	}

	hash_noise(a, b, seed){
		/**
		 * returns a "random" number between 0 and 1 that is always the same
		 * for the same (a, b, seed). This keeps the low poly mesh from
		 * wiggling every frame, and makes MAZE and MAZE_color line up.
		 */
		let n = Math.sin(a*127.1 + b*311.7 + seed*74.7) * 43758.5453
		return n - Math.floor(n)
	}

	build_mesh(){
		/**
		 * builds a grid of slightly "jittered" points, one per cell corner.
		 * neighbouring cells share the same corner points, so all the
		 * triangles fit together like a low poly terrain mesh.
		 *
		 *  corner grid is (vert_cells_num+1) by (hor_cells_num+1)
		 */
		let rows = this.vert_cells_num
		let cols = this.hor_cells_num
		let jitter = this.cellsize * 0.25

		this.mesh = []
		for (let r=0; r<=rows; r++){
			this.mesh.push([])
			for (let c=0; c<=cols; c++){
				let px = this.cellsize*c
				let py = this.cellsize*r
				// border points stay on the edge so the mesh fills the whole canvas
				if (c > 0 && c < cols){ px += (this.hash_noise(r, c, 1) - 0.5) * 2 * jitter }
				if (r > 0 && r < rows){ py += (this.hash_noise(r, c, 2) - 0.5) * 2 * jitter }
				this.mesh[r].push({x: px, y: py, n: this.hash_noise(r, c, 3)})
			}
		}

		this.centers = []
		for (let r=0; r<rows; r++){
			this.centers.push([])
			for (let c=0; c<cols; c++){
				let [tl, tr, br, bl] = this.cell_corners(r, c)
				this.centers[r].push({
					x: (tl.x + tr.x + br.x + bl.x)/4 + (this.hash_noise(r, c, 4) - 0.5) * this.cellsize * 0.2,
					y: (tl.y + tr.y + br.y + bl.y)/4 + (this.hash_noise(r, c, 5) - 0.5) * this.cellsize * 0.2,
				})
			}
		}

		// direction the sun shines from (top left, above the map)
		let lx = -0.5, ly = -0.7, lz = 1.0
		let len = Math.sqrt(lx*lx + ly*ly + lz*lz)
		this.light = {x: lx/len, y: ly/len, z: lz/len}
	}

	cell_corners(row, col){
		// returns the 4 corner points of a cell: [top left, top right, bottom right, bottom left]
		return [this.mesh[row][col], this.mesh[row][col+1], this.mesh[row+1][col+1], this.mesh[row+1][col]]
	}

	terrain_style(tile){
		/**
		 * the low poly look of each tile type
		 *  c    = base color [r,g,b]
		 *  h    = ground height
		 *  peak = extra height pushed up in the middle of the cell (mountains & hills)
		 */
		if (tile == 0){
			return {c: [190, 214, 140], h: 0.18, peak: 0} } // path (meadow)
		else if (tile == 1){
			return {c: [112, 104, 100], h: 0.9, peak: 0.8} } // wall (rocky mountain)
		else if (tile == 2){
			return {c: [72, 146, 214], h: -0.1, peak: 0} } // water
		else if (tile == 3){
			return {c: [236, 242, 250], h: 0.55, peak: 0.3} } // snow (snowy hills)
		else if (tile == 4){
			return {c: [92, 150, 70], h: 0.3, peak: 0} } // forest (ground under the trees)
		else if (tile == 5){
			return {c: [238, 216, 150], h: 0.08, peak: 0} } // sand
		else if (tile == 6){
			return {c: [255, 102, 178], h: 0.18, peak: 0} } // start
		else if (tile == 7){
			return {c: [255, 0, 0], h: 0.18, peak: 0} } // end
		else {
			return {c: [190, 214, 140], h: 0.18, peak: 0} } // traversed / unknown -> meadow
	}

	compute_heights(){
		/**
		 * every corner point gets a height = average height of the (up to 4)
		 * cells touching it, plus a little noise so flat ground still looks faceted
		 */
		let rows = this.vert_cells_num
		let cols = this.hor_cells_num
		let heights = []
		for (let r=0; r<=rows; r++){
			heights.push([])
			for (let c=0; c<=cols; c++){
				let total = 0
				let count = 0
				for (let [rr, cc] of [[r-1, c-1], [r-1, c], [r, c-1], [r, c]]){
					if (rr >= 0 && rr < rows && cc >= 0 && cc < cols){
						total += this.terrain_style(this.data[rr][cc]).h
						count += 1
					}
				}
				heights[r].push(total/count + (this.mesh[r][c].n - 0.5) * 0.12)
			}
		}
		return heights
	}

	shade(a, b, c){
		/**
		 * flat shading: works out which way the triangle is facing (its normal)
		 * and how much it faces the sun. returns a brightness multiplier,
		 * flat ground = 1.0, slopes facing the sun > 1, slopes facing away < 1
		 */
		let z_scale = this.cellsize * 0.6
		let ux = b.x - a.x, uy = b.y - a.y, uz = (b.h - a.h) * z_scale
		let vx = c.x - a.x, vy = c.y - a.y, vz = (c.h - a.h) * z_scale
		let nx = uy*vz - uz*vy
		let ny = uz*vx - ux*vz
		let nz = ux*vy - uy*vx
		if (nz < 0){ nx = -nx; ny = -ny; nz = -nz } // always point the normal up
		let len = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1
		let dot = (nx*this.light.x + ny*this.light.y + nz*this.light.z) / len
		return (0.35 + 0.65*Math.max(dot, 0)) / (0.35 + 0.65*this.light.z)
	}

	draw_facet(a, b, c, base, strength, variation){
		// draws one low poly triangle, colored by the base color and the sun
		let s = 1 + (this.shade(a, b, c) - 1) * strength
		s *= variation
		let col = [base[0]*s, base[1]*s, base[2]*s]
		fill(col[0], col[1], col[2])
		stroke(col[0], col[1], col[2]) // same color stroke hides gaps between triangles
		triangle(a.x, a.y, b.x, b.y, c.x, c.y)
	}

	draw_tree(cx, cy, size){
		// a little low poly pine tree: sunny left half, shady right half
		let h = size
		let w = size * 0.38
		noStroke()
		fill(96, 66, 42)
		rect(cx - 1, cy + h*0.2, 2, h*0.22) // trunk
		fill(58, 128, 58)
		triangle(cx, cy - h*0.7, cx - w, cy + h*0.25, cx, cy + h*0.25) // left (lit)
		fill(34, 88, 44)
		triangle(cx, cy - h*0.7, cx, cy + h*0.25, cx + w, cy + h*0.25) // right (shadow)
	}

	draw_flag(cx, cy, c){
		// start / end marker: a pole with a two tone pennant
		let s = this.cellsize
		stroke(60, 50, 45)
		strokeWeight(1.5)
		line(cx, cy + s*0.3, cx, cy - s*0.6)
		noStroke()
		fill(c[0], c[1], c[2])
		triangle(cx, cy - s*0.6, cx + s*0.55, cy - s*0.45, cx, cy - s*0.3)
		fill(c[0]*0.7, c[1]*0.7, c[2]*0.7)
		triangle(cx, cy - s*0.45, cx + s*0.55, cy - s*0.45, cx, cy - s*0.3)
		strokeWeight(1)
	}

	render_map(){
		if (this.mesh == null){ this.build_mesh() }

		let vert_cells_num = Math.floor(this.height/this.cellsize)
		let hor_cells_num = Math.floor(this.width/this.cellsize)
		let heights = this.compute_heights()
		strokeWeight(1)

		// pass 1: the ground triangles
		for (let y=0; y<vert_cells_num; y++){
			for (let x=0; x<hor_cells_num; x++){
				// draw the sqaure with different color base on the tile data.
				//once done push to your maze branch again
				/**
				 * git checkout <branchname> ( move to "branchname" branch)
				 * git status ( to check the current staging area, and branch)
				 *
				 * 1. git add . (add all change to staging area)
				 * 2. git commit -m "message"  ( confirm changes in staging area)
				 * 3. git push ( )
				 */
				let style = this.terrain_style(this.data[y][x])
				let [ctl, ctr, cbr, cbl] = this.cell_corners(y, x)
				let tl = {x: ctl.x, y: ctl.y, h: heights[y][x]}
				let tr = {x: ctr.x, y: ctr.y, h: heights[y][x+1]}
				let br = {x: cbr.x, y: cbr.y, h: heights[y+1][x+1]}
				let bl = {x: cbl.x, y: cbl.y, h: heights[y+1][x]}

				let strength = 1
				let wave = 1
				if (this.data[y][x] == 2){ // water: softer light + a slow shimmer
					strength = 0.4
					wave = 1 + 0.05*Math.sin(frameCount*0.04 + this.hash_noise(y, x, 6)*6.28)
				}

				if (style.peak > 0){
					// mountains & hills: 4 triangles meeting at a raised middle point
					let mid = this.centers[y][x]
					let peak = style.peak * (0.6 + 0.8*this.hash_noise(y, x, 7))
					let m = {x: mid.x, y: mid.y, h: (tl.h + tr.h + br.h + bl.h)/4 + peak}
					this.draw_facet(tl, tr, m, style.c, strength, 0.97 + 0.06*this.hash_noise(y, x, 10))
					this.draw_facet(tr, br, m, style.c, strength, 0.97 + 0.06*this.hash_noise(y, x, 11))
					this.draw_facet(br, bl, m, style.c, strength, 0.97 + 0.06*this.hash_noise(y, x, 12))
					this.draw_facet(bl, tl, m, style.c, strength, 0.97 + 0.06*this.hash_noise(y, x, 13))
				}
				else if (this.hash_noise(y, x, 8) < 0.5){
					// flat ground: split the cell into 2 triangles along a random diagonal
					this.draw_facet(tl, tr, br, style.c, strength, wave * (0.96 + 0.08*this.hash_noise(y, x, 10)))
					this.draw_facet(tl, br, bl, style.c, strength, wave * (0.96 + 0.08*this.hash_noise(y, x, 11)))
				}
				else {
					this.draw_facet(tl, tr, bl, style.c, strength, wave * (0.96 + 0.08*this.hash_noise(y, x, 10)))
					this.draw_facet(tr, br, bl, style.c, strength, wave * (0.96 + 0.08*this.hash_noise(y, x, 11)))
				}
			}
		}

		// pass 2: things standing on the ground (trees, flags), drawn top to bottom so they overlap nicely
		for (let y=0; y<vert_cells_num; y++){
			for (let x=0; x<hor_cells_num; x++){
				let mid = this.centers[y][x]
				if (this.data[y][x] == 4){ // forest
					this.draw_tree(mid.x, mid.y, this.cellsize * (0.75 + 0.35*this.hash_noise(y, x, 9)))
				}
				else if (this.data[y][x] == 6){ // start
					this.draw_flag(mid.x, mid.y, this.terrain_style(6).c)
				}
				else if (this.data[y][x] == 7){ // end
					this.draw_flag(mid.x, mid.y, this.terrain_style(7).c)
				}
				else if (this.data[y][x] == 10 || this.data[y][x] == 11){} // traversed
			}
		}
	}

	draw_cell_overlay(y, x){
		// fills the whole (jittered) cell shape, so overlays line up with the terrain
		let [tl, tr, br, bl] = this.cell_corners(y, x)
		quad(tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y)
	}

	render_color(){
		/**
		 * draw the maze on the canvas using the attributes
		 *  0 = blank , walkable tile
		 *  1 = wall,
		 *  2 = water
		 *  3 = snow
		 *  4 = forest
		 *  5 = sand
		 */
		if (this.mesh == null){ this.build_mesh() }

		let vert_cells_num = Math.floor(this.height/this.cellsize)
		let hor_cells_num = Math.floor(this.width/this.cellsize)
		noStroke()
		for (let y=0; y<vert_cells_num; y++){
			for (let x=0; x<hor_cells_num; x++){
				// draw the sqaure with different color base on the tile data.
				//once done push to your maze branch again
				/**
				 * git checkout <branchname> ( move to "branchname" branch)
				 * git status ( to check the current staging area, and branch)
				 *
				 * 1. git add . (add all change to staging area)
				 * 2. git commit -m "message"  ( confirm changes in staging area)
				 * 3. git push ( )
				 */
				if (this.data[y][x] == 6){
					fill(255,102,178,255);
					this.draw_cell_overlay(y, x)} // start
				else if (this.data[y][x] == 7){
					fill(255,0,0,255);
					this.draw_cell_overlay(y, x)}//end
				else if (this.data[y][x] == 10){ // traversed
					fill(255,30,200,110);
					this.draw_cell_overlay(y, x)}
				else if (this.data[y][x] == 11){ // final path
					fill(255,165,0,170);
					this.draw_cell_overlay(y, x)
				}
			}
		}
		strokeWeight(1)

	}// render_color()

} // Maze Class

if (typeof globalThis !== 'undefined') {
	globalThis.Maze = Maze;
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Maze;
}
