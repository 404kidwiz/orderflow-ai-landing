import { ThreeElements } from "@react-three/fiber";

declare module "@react-three/fiber" {
  interface ThreeElements {
    ambientLight: ThreeElements["ambientLight"];
    pointLight: ThreeElements["pointLight"];
    directionalLight: ThreeElements["directionalLight"];
  }
}