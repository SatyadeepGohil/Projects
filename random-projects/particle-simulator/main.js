    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        resizeTo: window
    });

    document.body.appendChild(app.view);

    const engine = Matter.Engine.create();
    const world = engine.world;
    world.gravity.y = 0;

    function createWalls() {
            const radius = 10;
        return [
            Matter.Bodies.rectangle(app.screen.width / 2, app.screen.height - radius, app.screen.width, radius * 2, { isStatic: true }),
            Matter.Bodies.rectangle(radius, app.screen.height / 2, radius * 2, app.screen.height, { isStatic: true }),
            Matter.Bodies.rectangle(app.screen.width - radius, app.screen.height / 2, radius * 2, app.screen.height, { isStatic: true }),
            Matter.Bodies.rectangle(app.screen.width / 2, radius, app.screen.width, radius * 2, { isStatic: true })
        ];
    }

    let walls = createWalls();
    Matter.World.add(world, walls);

    const cells = [];
    const numberOfCells = 200;

    const CellTypes = {
        PREDATOR: 'PREDATOR',
        PREY: 'PREY',
        FOOD: 'FOOD'
    };

    const PREDATOR_COLOR = 0xFF0000;
    const PREY_COLOR = 0x0000FF;
    const FOOD_COLOR = 0x00FF00;


    function addCell(x,y,type) {
        const size = Math.ceil(Math.random() * 10);
        const graphics = new PIXI.Graphics();
        graphics.beginFill(type === CellTypes.PREDATOR ? PREDATOR_COLOR : type === CellTypes.PREY ? PREY_COLOR : FOOD_COLOR);
        graphics.drawCircle(0,0,size);
        graphics.endFill();
        graphics.x = x;
        graphics.y = y;
        app.stage.addChild(graphics);

    const body = Matter.Bodies.circle(x,y, size, { restitution: 0.1, label: type});
    Matter.World.add(world, body);

    cells.push({ graphics, body , type, size, age: 0, consumed: 0});
    }

    for (let i = 0; i <numberOfCells; i++) {
        if (i <= 5) type = CellTypes.PREDATOR;
        else if (i <= 20) type = CellTypes.PREY;
        else type = CellTypes.FOOD;
        addCell(Math.random() * app.screen.width, Math.random() * app.screen.height, type);
    }


    function applyCellForces() {
        const attractionStrength = 0.01;
        const repulsionStrength = 0.05;
        const minDistance = 20;
        const maxForce = 0.001;
        const epsilon = 0.0001;

        for (let i = 0; i < cells.length; i++) {
            for (let j = i + 1; j < cells.length; j++) {
                const cellA = cells[i].body;
                const cellB = cells[j].body;

                const distanceVector = Matter.Vector.sub(cellB.position, cellA.position);
                const distance = Matter.Vector.magnitude(distanceVector) + epsilon;

                if (distance < minDistance) continue;

                const direction = Matter.Vector.normalise(distanceVector);

                let forceMagnitude = 0;

                switch(cells[i].type) {
                    case CellTypes.PREDATOR:
                        switch (cells[j].type) {
                            case CellTypes.PREY:
                                forceMagnitude = attractionStrength / (distance * distance);
                                break;
                                default:
                                    forceMagnitude = 0;
                        }
                        break;
                        case CellTypes.PREY:
                            switch(cells[j].type) {
                                case CellTypes.FOOD:
                                    forceMagnitude = attractionStrength / (distance * distance);
                                    break;
                                    default:
                                        forceMagnitude = 0;
                            }
                            break;
                                default:
                                    forceMagnitude = 0;
                }

                forceMagnitude = Math.min(forceMagnitude, maxForce);
                forceMagnitude = Math.max(forceMagnitude, -maxForce);

                const force = Matter.Vector.mult(direction, forceMagnitude);
                Matter.Body.applyForce(cellA, cellA.position, force);
                Matter.Body.applyForce(cellB, cellB.position, Matter.Vector.neg(force));
            }
        }
    }

    function reproduceCells() {
        const reproductionThreshold = 100;
        const maxCells = 500;
        const newCells = [];

        for (const cell of cells) {
            if (cell.consumed >= 3 && cells.length + newCells.length < maxCells) {
                const x = cell.body.position.x + (Math.random() * 100 - 10);
                const y = cell.body.position.y + (Math.random() * 100 - 10);
                newCells.push({ x,y, type: cell.type});
                cell.consumed = 0;
            }
        }

        for (const newCell of newCells) {
            addCell(newCell.x, newCell.y, newCell.type);
        }

        if (cells.length < maxCells) {
            const foodX = Math.random() * app.screen.width;
            const foodY = Math.random() * app.screen.height;
            addCell(foodX, foodY, CellTypes.FOOD);
        }
    }

    function updateCellAging() {
        const maxAge = 1000;

        for (let i = cells.length - 1; i >= 0; i--) {
            cells[i].age += 1;
            if (cells[i].age > maxAge) {
                app.stage.removeChild(cells[i].graphics);
                Matter.World.remove(world, cells[i].body);
                cells.splice(i,1);
            }
        }
    }

    function handleCellInteractions() {
        for (let i = cells.length - 1; i >= 0; i--){
            const cellA = cells[i];
            for (let j = cells.length - 1; j >= 0; j--) {
                if ( i === j) continue;
                const cellB = cells[j];

                const distance = Matter.Vector.magnitude(Matter.Vector.sub(cellB.body.position, cellA.body.position));

                if(distance < 20) {
                    switch(cellA.type) {
                        case CellTypes.PREDATOR:
                            switch (cellB.type) {
                                 case CellTypes.PREY:
                                app.stage.removeChild(cellB.graphics);
                                Matter.World.remove(world, cellB.body);
                                cells.splice(j,1);
                                cellA.age = 0;
                                cellA.consumed++;
                                break;
                            }
                            break;
                            case CellTypes.PREY:
                                switch (cellB.type) {
                                    case CellTypes.FOOD:
                                app.stage.removeChild(cellB.graphics);
                                Matter.World.remove(world, cellB.body);
                                cells.splice(j,1);
                                cellA.age = 0;
                                cellA.consumed++;
                                break;
                                }
                                break;
                    }
                }
            }
        }
    }

    app.ticker.add(() => {
        Matter.Engine.update(engine, app.ticker.deltaMS);

        applyCellForces();
        reproduceCells();
        updateCellAging();
        handleCellInteractions();
        

        for (const cell of cells) {
            cell.graphics.position.set(cell.body.position.x, cell.body.position.y);
            cell.graphics.rotation = cell.body.angle;
        }
    })

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);

        Matter.World.remove(world, walls);
        walls = createWalls();
        Matter.World.add(world, walls);
    });
