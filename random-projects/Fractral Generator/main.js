class FractalForest {
    constructor (canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.gravity = 0.05;
        this.windForce = 0;
        this.windFrequency = 0;

        this.trees = [];
        this.fallenFruits = [];

        // intial tree
        this.addTree(this.canvas.width /2, this.canvas.height);

        this.lastFrameTime = performance.now();
        this.frameCounter = 0;
        this.fps = 0;

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    addTree(x, y) {
        const tree = {
            x: x,   // base position of the tree, x
            y: y,   // base position of the tree, y
            age: 0, // current age of the tree
            maxDepth: 0,    // current growth depth 
            targetMaxDepth: 8 + Math.floor(Math.random() * 4), // final growth to reach
            branches: [], // stored branches for physics
            fruits: [], // storing fruits
            maturityAge: 700 + Math.floor(Math.random() * 300), // when tree will maturity
            deathAge: 800 + Math.floor(Math.random() * 800), // when tree will die
            isDying: false, // flag for dying state
            deathProgress: 0, // progress of death for animation
            energy: 100 // energy for the fruit production
        };

        this.trees.push(tree);
    }

    updateWind() {
        // this condition controls how many times the wind will appear on the screen
        if (Math.random() < 0.001) {
            this.windForce = (Math.random() * 0.4 - 0.2) * (Math.random() < 0.5 ? - 1 : 1);
            this.windFrequency = 60 + Math.random() * 100;
        }

        if (this.windFrequency > 0) {
            this.windFrequency--;
        } else {
            this.windForce *= 0.85;
        }
    }

    drawTree (tree) {
        if (tree.maxDepth < tree.targetMaxDepth) {
            tree.branches = [];
        }

        this.drawBranch(
            tree.x,
            tree.y,
            -Math.PI / 2,
            120,
            tree.maxDepth,
            0,
            tree
        );

        if (tree.maxDepth < tree.targetMaxDepth) {
            tree.maxDepth += 0.05;
        }

        this.updateFruits(tree);

        // energy regeneration
        if (tree.age > tree.maturityAge * 0.4 && !tree.isDying && tree.energy < 100) {
            tree.energy += 0.05;
        }

        // aging added
        tree.age++;

        if (tree.age > tree.deathAge && !tree.isDying) {
            tree.isDying = true;
        }

        if (tree.isDying) {
            tree.deathProgress += 0.05;

            if (tree.deathProgress >= 1) {
                const index = this.trees.indexOf(tree);
                if (index !== -1) {
                    this.trees.splice(index, 1);
                }
            }
        }
    }

    drawBranch(x, y, angle, length, maxDepth, currentDepth, tree) {
        if (currentDepth > maxDepth) return;

        const growthFactor = Math.min(1, (tree.maxDepth - currentDepth) / 1);
        const actualLength = length * growthFactor;

        if (actualLength <= 0) return;

        let branchAngle = angle;

        const windEffect = this.windForce * (currentDepth / maxDepth);
        branchAngle += windEffect;

        const gravityEffect = this.gravity * Math.abs(Math.cos(angle)) * (currentDepth / 3);
        branchAngle += gravityEffect;

        const x2 = x + Math.cos(branchAngle) * actualLength;
        const y2 = y + Math.sin(branchAngle) * actualLength;

        // storing branch data for physics calculations, for right now trigger when the tree is mature
        if (tree.maxDepth >= tree.targetMaxDepth) {

            let branchExists = false;
            for (const branch of tree.branches) {
                if (branch.depth === currentDepth &&
                    branch.startX === x &&
                    branch.startY === y
                ) {
                    branchExists = true;
                    branch.angle = branchAngle;
                    branch.endX = x2;
                    branch.endY = y2;
                    break;
                }
            }

            if (!branchExists) {
                tree.branches.push({
                    startX: x,
                    startY: y,
                    endX: x2,
                    endY: y2,
                    angle: branchAngle,
                    depth: currentDepth
                });
            }
        }

        // this draws the branch
        this.ctx.save();

        // if tree is dying then dying effect will trigger
        if (tree.isDying) {
            const withering = Math.min(1, tree.deathProgress * 2);
            const hue = 36 * currentDepth * (1 - withering);
            const lightness = (30 + currentDepth * 5) * (1 - withering * 0.7);
            this.ctx.strokeStyle = `hsl(${hue}, ${100 - withering * 60}%, ${lightness}%)`;
        } else {
            this.ctx.strokeStyle = `hsl(${currentDepth * 36}, 100%, ${30 + currentDepth * 5}%)`;
        }

        this.ctx.lineWidth = currentDepth > 5 ? 1 : 4 - (tree.isDying ? tree.deathProgress * 2 : 0);
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.restore();

        // fruit creation logic
        const maxFruitPerBranch = 3;
        const fruitCountAtDepth = tree.fruits.filter(f => f.branchDepth === currentDepth).length;

        if (!tree.isDying &&
            currentDepth > maxDepth - 1 &&
            tree.age > tree.maturityAge * 0.4 &&
            Math.random() < 0.005 &&
            fruitCountAtDepth < maxFruitPerBranch &&
            tree.energy >= 10 /* && */
            /* tree.fruits.length < tree.targetMaxDepth * 2 */
        ) {
            const hue = Math.random() * 360;
            const fruitExists = tree.fruits.some(f => 
                Math.abs(f.x - x2) < 5 && Math.abs(f.y - y2) < 5
            );

            // creating fruit consumes energy
            if (!fruitExists) {
                tree.fruits.push({
                    x: x2,
                    y: y2,
                    color: `hsl(${hue}, 100%, 70%)`,
                    maturityAge: 0,
                    maxMaturityAge: 200 + Math.floor(Math.random() * 100),
                    falling: false,
                    fallSpeed: 0,
                    radius: 0,
                    branchDepth: currentDepth,
                    maxRadius: 3 + Math.random() * 2, // controls maximum radius of each fruit
                    branchIndex: tree.branches.length - 2, // tracking this fruit to know which branch it is on
                    relativePos: 1 // Position at the end of the branch
                });

                // consumption of energy when creating the fruit
                tree.energy -= 10;
            }
        }

        if (currentDepth < maxDepth - 1) {
            this.drawBranch(
                x2, y2,
                branchAngle - 0.4,
                length * 0.78,
                maxDepth,
                currentDepth + 1,
                tree
            );

            this.drawBranch(
                x2, y2,
                branchAngle + 0.4,
                length * 0.78,
                maxDepth,
                currentDepth + 1,
                tree
            );
        }
    }

    updateFruits(tree) {
        for (let i = tree.fruits.length - 1; i >= 0; i--) {
            const fruit = tree.fruits[i];

            // updating fruit position based on it's branch position
            if (!fruit.falling && fruit.branchIndex !== undefined) {
                const branch = tree.branches.find((b, idx) => idx === fruit.branchIndex);

                if (branch) {
                    
                    if (fruit.relativePos === undefined) {
                        // finding fruit's intial relative position
                        const branchVector = {
                            x: branch.endX - branch.startX,
                            y: branch.endY - branch.startY
                        };
                        const fruitVector = {
                            x: fruit.x - branch.startX,
                            y: fruit.y - branch.startY
                        }

                        // Projeting fruit position to branch vector to get the relative position
                        const branchLength = Math.sqrt(branchVector.x * branchVector.x + branchVector.y * branchVector.y);
                        const dotProduct = (fruitVector.x * branchVector.x + fruitVector.y * branchVector.y) / (branchLength * branchLength);

                        //storing relative psotioin for future updates reducing potential load
                        fruit.relativePos = Math.max(0, Math.min(1, dotProduct));
                    }

                    // applying relative positioin to the current branch position
                    fruit.x = branch.startX + (branch.endX - branch.startX) * fruit.relativePos;
                    fruit.y = branch.startY + (branch.endY - branch.startY) * fruit.relativePos;
                }
            }

            this.ctx.save();

            // only using composition for mature fruits
            if (fruit.radius > fruit.maxRadius * 0.7) {
                this.ctx.globalCompositionOperation = 'lighter';
            }

            if (fruit.radius < fruit.maxRadius && !fruit.falling) {
                fruit.radius += 0.05;
            }

            // outer glow of only mature fruits
            if (fruit.radius >= fruit.maxRadius * 0.9) {
                this.ctx.shadowColor = fruit.color;
                this.ctx.shadowBlur = 5;
            }

            // main body of the fruit
            this.ctx.beginPath();
            this.ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = fruit.color;
            this.ctx.fill();

            //Highlight
            if (fruit.radius > 1) {
                this.ctx.beginPath();
                this.ctx.arc(
                    fruit.x - fruit.radius * 0.3,
                    fruit.y - fruit.radius * 0.3,
                    fruit.radius * 0.4,
                    0,
                    Math.PI * 2
                );
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                this.ctx.fill();
            }
            
            this.ctx.restore();

            fruit.maturityAge++;

            
            if ((fruit.maturityAge > fruit.maxMaturityAge || tree.isDying) && !fruit.falling) {
                fruit.falling = true;
            }

            if (fruit.falling) {
                fruit.x += this.windForce * 0.5;

                fruit.fallSpeed += this.gravity * 0.5;
                fruit.y += fruit.fallSpeed;

                if (fruit.y > this.canvas.height) {
                    tree.fruits.splice(i, 1);

                    if (!tree.isDying) {
                        this.fallenFruits.push({
                            x: fruit.x,
                            y: this.canvas.height,
                            germinationTime: 300 + Math.floor(Math.random() * 200),
                            age: 0,
                            sprouted: false,
                            radius: fruit.radius
                        });
                    }
                }
            }
        }
    }

    processFallenFruits() {
        for (let i = this.fallenFruits.length - 1; i >=0; i--) {
            const fallenFruit = this.fallenFruits[i];
            const radius = fallenFruit.radius || 3;

            this.ctx.save();
            this.ctx.fillStyle = 'rgba(200, 200, 50, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(fallenFruit.x, fallenFruit.y - 2, radius, 0, Math.PI * 2);
            this.ctx.fill();

            // germination indicator for the fruit ready to sprout
            if (fallenFruit.age > fallenFruit.germinationTime * 0.9 && !fallenFruit.sprouted) {
                this.ctx.fillStyle = 'rgba(100, 255, 100, 0.5)';
                this.ctx.beginPath();
                this.ctx.arc(fallenFruit.x, fallenFruit.y - 4, radius * 0.7, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();

            fallenFruit.age++;

            // check if it's time for the fruit to germinate
            if (fallenFruit.age > fallenFruit.germinationTime && !fallenFruit.sprouted) {
                fallenFruit.sprouted = true;

                // minimum distance check
                const tooClose = this.trees.some(tree => 
                    Math.abs(tree.x - fallenFruit.x) < 100
                );

                // only grow if not too close and not too many trees
                if (!tooClose && this.trees.length < 12) {
                    this.addTree(fallenFruit.x, this.canvas.height);
                }

                this.fallenFruits.splice(i, 1);
            }
        }
    }

    animate() {
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;

        // upadting fps counter every second
        this.frameCounter++;
        if (elapsed > 1000) {
            this.fps = Math.round((this.frameCounter * 1000) / elapsed);
            this.frameCounter = 0;
            this.lastFrameTime = now;

            // skipping background clearing every frame fro perfomance if fps is low
            if (this.fps < 30) {
                this.clearEveryFrame = false;
            } else {
                this.clearEveryFrame = true;
            }
        }

        // using a lighter color methaod during low fps
        if (this.clearEveryFrame || this.frameCounter % 2 === 0) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // wind updates
        this.updateWind();

        // processing trees
        for (const tree of this.trees) {
            this.drawTree(tree);
        }

        this.processFallenFruits();

        requestAnimationFrame(this.animate);
    }

}

window.onload = () => {
    new FractalForest('canvas');
}