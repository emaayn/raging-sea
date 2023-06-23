import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import waterVertex from './shaders/water/vertex.glsl'
import waterFragment from './shaders/water/fragment.glsl'
import { DoubleSide } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
//loader 
const loader = new THREE.TextureLoader()


/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneBufferGeometry(50, 50, 512, 512)
//Color
debugObject.depthColor = '#00456e'
debugObject.surfaceColor = '#7c7cbe'
// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader:waterVertex,
    fragmentShader: waterFragment,
    side:DoubleSide,
    uniforms: {
        uTime: {value: 0},
        uBigWavesElevation: { value : 0.2 },
        uBigWavesFrequency: { value : new THREE.Vector2(4, 1.5) },
        uBigWavesSpeedX: {value: 0.75},
        uBigWavesSpeedZ: {value: 0.75},
        uSmallWavesElevation: {value: 0.15},
        uSmallWavesFrequency: {value: 3.0},
        uSmallWavesSpeed: {value: 0.2},
        uSmallIterations: {value: 4.0},
        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 }
    }
})
//GUI ADD SECTION
const waveControl = gui.addFolder('Wave Controls')
waveControl.add(waterMaterial.uniforms.uBigWavesElevation, 'value', 0, 1, 0.001).name('BigWavesElevation')
waveControl.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x', 0, 10, 0.001).name('BigWavesFrequencyX')
waveControl.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y', 0, 10, 0.001).name('BigWavesFrequencyZ')
waveControl.add(waterMaterial.uniforms.uBigWavesSpeedX, 'value', 0, 4, 0.001).name('uBigWavesSpeedX')
waveControl.add(waterMaterial.uniforms.uBigWavesSpeedZ, 'value', 0, 4, 0.001).name('uBigWavesSpeedZ')
waveControl.add(waterMaterial.uniforms.uSmallWavesElevation, 'value', 0, 2, 0.001).name('uSmallWavesElevation')
waveControl.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value', 0, 2, 0.001).name('uSmallWavesSpeed')
waveControl.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value', 0, 6, 0.001).name('uSmallWavesFrequency')
waveControl.add(waterMaterial.uniforms.uSmallIterations, 'value', 0, 6, 1).name('uSmallIterations')

const colorControl = gui.addFolder('Color Controls')
colorControl.addColor(debugObject, 'depthColor').onChange(() =>{ waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) })
colorControl.addColor(debugObject, 'surfaceColor').onChange(() =>{ waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })
colorControl.add(waterMaterial.uniforms.uColorOffset, 'value', 0, 1, 0.001).name('uColorOffset')
colorControl.add(waterMaterial.uniforms.uColorMultiplier, 'value', 0, 10, 0.001).name('uColorMultiplier')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
scene.background = new THREE.CubeTextureLoader()
	.setPath( '/' )
	.load( [
		'skybox_0.png',
		'skybox_1.png',
		'skybox_2.png',
		'skybox_3.png',
		'skybox_4.png',
		'skybox_5.png'
	] );
//FOG
//const fog = new THREE.Fog('#262837', 1, 15)
//scene.fog = fog
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    waterMaterial.uniforms.uTime.value = elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()