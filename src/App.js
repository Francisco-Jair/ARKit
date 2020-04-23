import React, { useEffect } from 'react';
import { Asset } from 'expo-asset'
import ExpoTHREE, { THREE } from 'expo-three'
import { StyleSheet, Text, View } from 'react-native';
import { AR } from 'expo'
import * as ThreeAr from 'expo-three-ar'
import { View as GraphicsView } from 'expo-graphics'

export default function App() {
  let renderer
  let scene
  let camera
  let geometry
  let material
  let cube
  let points

  useEffect(() => {
    THREE.suppressExpoWarnings(true)
    //ThreeAr.suppressWarnings()
    //THREE.suppressExpoWarnings()
  }, [])

  async function onContextCreate({ gl, scale: pixelRatio, width, height }) {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal)

    renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height,
    })

    scene = new THREE.Scene()
    scene.background = new ThreeAr.BackgroundTexture(renderer)
    camera = new ThreeAr.Camera(width, height, 0.01, 1000)

    geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
    material = new THREE.MeshPhongMaterial({
      color: 0x7159c1,
    })

    cube = new THREE.Mesh(geometry, material)
    cube.position.z = -0.4


    scene.add(cube)

    scene.add(new THREE.AmbientLight(0xffffff))

    points = new ThreeAr.Points()
    scene.add(points)

  }

  function onResize({ x, y, scale, width, height }) {
    if (!renderer) {
      return
    }
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(scale)
    renderer.setSize(width, height)
  }

  function onRender() {
    points.update();
    cube.rotation.x += 0.1
    cube.rotation.y += 0.1
    renderer.render(scene, camera);
  }

  return (
    <GraphicsView
      style={{ flex: 1 }}
      onContextCreate={onContextCreate}
      onRender={onRender}
      onResize={onResize}
      isArEnabled
      isArRunningStateEnabled
      isArCameraStateEnabled
      arTrackingConfiguration={'ARWorldTrackingConfiguration'}
    />
  )
}

