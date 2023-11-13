
import * as THREE from "three";

export class Cube{
geometry = null
material = null
x=null
z=null
    constructor(x=100, z=100,color=0xffffff){
        this.geometry = new THREE.BoxGeometry(x,100,z)
        this.material = new THREE.MeshPhongMaterial({color:color})
    }
    getCube(){
        return new THREE.Mesh(this.geometry,this.material)
    }

}

export class Player{
    geometry = new THREE.BoxGeometry(10,50,10)
    material = new THREE.MeshPhongMaterial({color:0x000000})
    constructor( ){
    }
    getPlayer(){
        return new THREE.Mesh(this.geometry,this.material)
    }
}