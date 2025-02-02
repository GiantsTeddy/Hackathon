const debug = document.getElementById("debug");

let customersPerDay;
let dropdown;
let formArray = [];

let app = document.getElementById("apple")
let ban = document.getElementById("bananas")
let lett = document.getElementById("Lettuce")
let tom = document.getElementById("Tomatoes")

let chip = document.getElementById("")
let pret = document.getElementById("")
let pop = document.getElementById("")

let gran = document.getElementById("")
let prot = document.getElementById("")
let en = document.getElementById("")

let col = document.getElementById("")
let flav = document.getElementById("")
let lem = document.getElementById("")

let soup = document.getElementById("")
let bean = document.getElementById("")
let can = document.getElementById("")


let applicantAmt = 50;

let totalRevenue = 0
let totalTurnsSpentInStore = 0
let spacesBought = []
let popularProduct = ""

class Product {
    constructor(n, p, v){
        this.price = p
        this.name = n;
        this.value = v;
    }
}

class Shelf {
    constructor(inv){
        this.inventory = inv;
    }
}

class Bot {
    constructor(){

        this.boughtSpots = []
        this.turnsSpent = 0

        /*
        Distances to close objects//
        Price of product on shelf
        Delta price
        Money spent
        Time spent in store
        Impulse //
        */
        
        this.target = {x: null, y: null}
        this.tShelf = null;

        this.pos = {x: 3, y:3}
        this.prevPrice = 0;

        this.changing = [0,0,0,0,0,0]
        this.inits = [.45, -.7, .1, -5, -.15,.95]
        this.weights = []
        this.intercept = Math.random() * 5

        for(let i of this.changing){
            this.weights.push(Math.random())
        }

        this.terminate = false
    }

    /*gucciTime(){
        if(this.target==null || this.target.x==null || this.target.y==null) return false
        if(this.pos ==null || this.pos.x==null || this.pos.y==null) return false
        if()
    }*/

    aFunc(x){
        let sum = 0;
        for(let i of x){ sum+=i; }
        console.log(x)
        console.log(this.intercept)

        return 3 * (sum/x.length) + this.intercept;
    }

    updateEnvironment(board){
        //
        let d=1
        let maxProduct = null;

        //
        while(true){

            let coordToCheck = {x: this.pos.x-d, y: this.pos.y+d}

            let tempX = 0
            let tempY = 0
            
            while(coordToCheck.x < 0){ tempX++; coordToCheck.x++;}
            while(coordToCheck.y < 0){ tempY++; coordToCheck.y++;}

            let t = 0;

            for(let i = 0; i < (2*d+1)**2 - (2*(d-1)+1)**2; i++){
                console.log(coordToCheck)
                console.log(board[coordToCheck.y][coordToCheck.x])


                if(!(0 <= coordToCheck.x && coordToCheck.x <= 14) || !(0 <= coordToCheck.y && coordToCheck.y <= 14)){
                    console.log("out of bounds bruh")
                    maxProduct = board[this.pos.x][this.pos.y]
                    break;
                }


                if((0 <= coordToCheck.x && coordToCheck.x <= 14) && t==0){ coordToCheck.x += 1 } //Checking right
                else if((0 <= coordToCheck.y && coordToCheck.y <= 14) && t==1){ coordToCheck.y -= 1 } //Checking down
                else if((0 <= coordToCheck.x && coordToCheck.x <= 14) && t==2){ coordToCheck.x -= 1 } //Checking left
                else if((0 <= coordToCheck.y && coordToCheck.y <= 14) && t==3){ coordToCheck.y += 1 } //Checking up

                if(i!=0 && i%(2*d)==0){ t+=1 } //Turn at corner

                //Searches for max in thing
                //console.log(coordToCheck.x)
                //console.log(coordToCheck.y)
                //if(coordToCheck.x == 10 || coordToCheck.y){console.log(board[coordToCheck.x][coordToCheck.y])}
                
                if(board[coordToCheck.x][coordToCheck.y] == null || board[coordToCheck.x][coordToCheck.y] == ""){ continue }
                
                if(maxProduct == null){ 
                    maxProduct = board[coordToCheck.x][coordToCheck.y].inventory; 
                    this.target.x = coordToCheck.x
                    this.target.y = coordToCheck.y
                    this.tShelf = board[coordToCheck.x][coordToCheck.y]
                    console.log("prod found through default null")
                } else {
                    if(board[coordToCheck.x][coordToCheck.y].inventory.value > maxProduct.value){
                        maxProduct = board[coordToCheck.x][coordToCheck.y].inventory
                        this.target.x = coordToCheck.x
                        this.target.y = coordToCheck.y
                        this.tShelf = board[coordToCheck.x][coordToCheck.y]
                        console.log("!!!!!!!!!!!!!!! FOUND SMTH !!!!!!!!!!!!!!!!!!!!")
                    }
                }

                //d=1 : run 9 times
                //turn direction every i%2d==0, starting at (pos.x-d, pos.y+d)
                

            }

            if(maxProduct != null){console.log(maxProduct); break}
            d+=1

            if(this.actionID < 0){
                break
            }
        }

        this.changing[0] = d
        this.changing[1] = maxProduct.price; console.log("price " + maxProduct.price)
        this.changing[2] = this.prevPrice - maxProduct.price
        this.changing[5] = maxProduct.value

    }

    leave(){
        this.terminate = true
    }

    walk(){
        let dick = Math.random()
        if(dick < .40 && this.pos.x < 14){
            this.pos.x += 1
            console.log(this.pos.x)
            console.log(this.pos.y)
            return true
        } else if(dick < .5 && this.pos.x > 0){
            console.log(this.pos.x)
            console.log(this.pos.y)
            this.pos.x -= 1
            return true
        } else if(dick < .9 && this.pos.y < 14){
            console.log(this.pos.x)
            console.log(this.pos.y)
            this.pos.y += 1
            return true
        } else if(this.pos.y > 0){
            console.log(this.pos.x)
            console.log(this.pos.y)
            this.pos.y -= 1
            return true
        }
        return false
    }

    buy(){
        this.pos = this.target //Go to spot where product is
        this.boughtSpots.push(this.tShelf) //Add product spot to array of spaces
        this.prevPrice = this.changing[1] //Update prevPrice
        this.changing[3] += this.changing[1] //Add money to money spent
    }

    
    chooseAction(){
        let current = []

        for(let i = 0; i<this.changing.length; i++){
            current.push(this.changing[i] * this.inits[i] * this.weights[i])
            //console.log(current[i])
        }
        
        this.actionID = this.aFunc(current)

        console.log("Action: " + this.actionID)

        if(this.actionID < 0){ this.terminate = true; console.log("leave")}
        else if(this.actionID < 1.5 || this.target.x==null || this.target.y == null){ while(!this.walk()){} console.log("walk")} //Walk until successful walk
        else { this.buy(); console.log("buy") }
        
        this.turnsSpent += 1
    }
}



class Board {
    constructor(w, h){
        this.board = []
        for(let i = 0; i < h; i++){
            this.board.push([])
            for(let k = 0; k < w; k++){
                this.board[i].push("")
            }
            //this.board.push(new Array(w))
        }
        console.log(w)
        console.log(this.board)
    }
    setLayoutDef(){ //Array coords are [y][x] btw
        this.board[0][0] = "E" //Set entrance

        this.board[14][0] = "EE" //Set exit
        
        //Set 
        for(let i = 0; i < this.board.length; i+=2){
            for(let k = 0; k < 4; k++){
                let randIndex = Math.floor(Math.random() * formArray.length)
                this.board[i][3+k] = new Shelf(new Product(formArray[randIndex][0], formArray[randIndex][1], Math.random() * 15 + 15), 3+k, i)
            }
            for(let k = 0; k < 4; k++){
                let randIndex = Math.floor(Math.random() * formArray.length)
                this.board[i][9+k] = new Shelf(new Product(formArray[randIndex][0], formArray[randIndex][1], Math.random() * 15 + 15), 9+k, i)
            }
        }
        //debug.textContent = this.board
    }
}

function loadData(bot){
    totalRevenue += bot.changing[3]
    for(let s of bot.boughtSpots){
        spacesBought.push(s)
    }
    totalTurnsSpentInStore += bot.turnsSpent
}

function getFrequent(arr){
    let table = new Map()
    for(let ele of arr){
        if(table.get(ele.inventory.name) > 0){
            table.set(ele.inventory.name, table.get(ele.inventory.name) + 1)
        } else {
            table.set(ele.inventory.name, 1)
        }
    }
    
    console.log(table.entries)

    maxK = "";
    maxV = -100000;
    
    for (const [key, value] of table.entries()) {
        if(value > maxV){ maxK = key; maxV = value; } 
    }

    return maxK;
}

function displayData(){
    console.log("Revenue: " + totalRevenue)
    console.log("Most Frequent: " + getFrequent(spacesBought))
    console.log("Avg Time Spent In Store: " + (totalTurnsSpentInStore * 3)/applicantAmt)
}

function getStuffed(){
    let arr = []
    let cont = document.getElementsByClassName("Grid")[0]
    console.log(cont)
    console.log(cont.children)

    for(let div of cont.children){
        for(let ele of div.children){
            
            console.log(ele)
            
            if(ele.getAttribute("class")=="form-group"){
                if(ele.children[0].checked){
                    addable = [ele.children[0].getAttribute("id"), ele.children[2].value]
                    arr.push(addable)
                }
            }
        }
        return arr
    }
}

function runGame(){
    
    console.log("try")
    formArray = getStuffed()
    console.log("Array: " + formArray)

    let board = new Board(15, 15)
    board.setLayoutDef()

    let bot = new Bot()
    
    for(let i = 0; i < /*90 * */applicantAmt; i++){
        let gameLoop = setInterval(function f(){
            console.log(bot)

            
            bot.updateEnvironment(board.board)
            console.log("Envi Pass")
            bot.chooseAction()
            console.log("Action Pass")
            bot.changing[4] += 1
            
            window.onerror = function(message, source, lineno, colno, error) {
                // Your error handling code here
                console.log("stopped by error")
                loadData(bot)
                clearInterval(gameLoop);
            };

            if(bot.terminate){ console.log("stopped"); loadData(bot); clearInterval(gameLoop);}
            console.log(i)
        }, 10)
    }
    setTimeout(function (){
        displayData()
    }, 10 * applicantAmt * 10)
}

//runGame()


/*

//Bots need to look at their surroundings
//Bots need to be able to move
//Products must be able to be purchased
//The sim must be allowed to terminate

*/