import { Observable } from 'rxjs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function getScene(...args){
    return new THREE.Scene(...args);
}

export function loadFont(url) {
    return new Observable(observer => {
        try {
            const textLoader = new THREE.FontLoader();
            textLoader.load(url, (font) => {
                // console.log("font", font);
                observer.next(font);
            })
        } catch (error) {
            console.log("Load font failed");
            observer.error(error);
        }
    })
}

export function loadGltf(url) {
    return new Observable(observer => {
        try {
            const loader = new GLTFLoader();
            loader.load(url, (gltf) => {
                // console.log("gltf", gltf);
                observer.next(gltf);
            }, (xhr) => {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            }, (error) => {
                observer.error(error);
            })
        } catch (error) {
            console.log("Load gltf failed");
            observer.error(error);
        }
    });
}