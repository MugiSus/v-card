import Head from 'next/head'
import { Inter } from '@next/font/google'
import { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import styles from '../styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  useEffect(() => {
    const cardFrontImagePath = location.origin + location.pathname + '/mugisus-business-card-front-22aq.png';
    const cardBackImagePath = location.origin + location.pathname + '/mugisus-business-card-back-22aq.png';

    // three.js
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: document.getElementsByClassName(styles.canvas)[0],
    });

    const camera = new THREE.PerspectiveCamera(40);
    camera.position.set(0, 0, 2.5);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    const stage = new THREE.Object3D();
    const background = new THREE.Object3D();

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      const cardScaleFactor = window.innerWidth < 425 ? 0.45 : (window.innerWidth < 768 ? 0.6 : 0.75);
      stage.scale.set(cardScaleFactor, cardScaleFactor, cardScaleFactor); 
    }
    resize();
    window.addEventListener('resize', resize);
    
    scene.add(stage);
    scene.add(background);

    const x = 0;
    const y = 0;
    const w = 1;
    const h = 1;
    const xr = 20 / 728;
    const yr = 20 / 440;

    const shape = new THREE.Shape()
      .moveTo(x, y + yr)
      .lineTo(x, y + h - yr)
      .quadraticCurveTo(x, y + h, x + xr, y + h)
      .lineTo(x + w - xr, y + h)
      .quadraticCurveTo(x + w, y + h, x + w, y + h - yr)
      .lineTo(x + w, y + yr)
      .quadraticCurveTo(x + w, y, x + w - xr, y)
      .lineTo(x + xr, y)
      .quadraticCurveTo(x, y, x, y + yr )

    const cardGeometry = new THREE.ShapeGeometry(shape, 8);

    const backgroundIcosphereMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.5, 6),
      new THREE.MeshBasicMaterial({
        color: 0xb0b0b0,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      })
    );

    const textureCardFront = new THREE.TextureLoader().load(cardFrontImagePath);
    const textureCardBack = new THREE.TextureLoader().load(cardBackImagePath);

    const cardFrontMesh = new THREE.Mesh(
      cardGeometry,
      new THREE.MeshBasicMaterial({
        map: textureCardFront,
        side: THREE.DoubleSide,
      })
    );
    cardFrontMesh.scale.set(1.6545, 1, 1);
    cardFrontMesh.position.set(-1.6545 / 2, -0.5, 0.0082);

    const cardBackMesh = new THREE.Mesh(
      cardGeometry,
      new THREE.MeshBasicMaterial({
        map: textureCardBack,
        side: THREE.DoubleSide,
      })
    );
    cardBackMesh.scale.set(1.6545, 1, 1);
    cardBackMesh.position.set(1.6545 / 2, -0.5, -0.0082);
    cardBackMesh.rotation.set(0, Math.PI, 0);
    
    const cardSideMesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.016,
        bevelEnabled: false,
      }),
      new THREE.MeshBasicMaterial({
        color: 0xE7E2D3,
      })
    );
    cardSideMesh.scale.set(1.6545, 1, 1);
    cardSideMesh.position.set(-1.6545 / 2, -0.5, -0.008);
    
    stage.add(cardFrontMesh, cardBackMesh, cardSideMesh);
    stage.quaternion.setFromAxisAngle(new THREE.Vector3(-0.25, 1, 0).normalize(), 0.25 * Math.PI);
    background.add(backgroundIcosphereMesh);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.update();

    let cardYPos = -2;

    const animate = (time: number) => {
      const rad = time / 5000 * Math.PI / 2;

      cardYPos += (0.01 - cardYPos) * 0.04;
      stage.position.set(0, cardYPos + Math.sin(rad * 4) * 0.01, 0);

      controls.update();
      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);
  }, [])

  const redirectHome = () => {
    window.top!.location.href = 'https://mugisus.com';
  }

  return (
    <main className={styles.main}>
      <Head>
        <title>Virtual Card</title>
        <meta name="description" content="A virtual introduction card of MugiSus" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <canvas className={styles.canvas} />
      <div className={styles.mugisusComComtainer} onClick={redirectHome}>
        <span className={`${inter.className} ${styles.mugisusComArrow}`}>{"<-"}</span>
        <span className={`${inter.className} ${styles.mugisusComTitle}`}>MugiSus.com</span>
      </div>
    </main>
  )
}