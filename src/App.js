import React, { Component } from 'react'
import * as THREE from 'three'
import Stats from 'stats.js'

var OrbitControls = require('three-orbit-controls')(THREE)

var width = window.innerWidth, height = window.innerHeight;

var mouse;

class Scene extends Component {
  constructor(props) {
    super(props)

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
  }

  componentDidMount() {
    var scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.00008);
    var camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      1,
      100000
    )
    camera.position.set( 0, 0, 2000 )

    var renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(width, height)
    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    //systems
    var sceneRoot = new THREE.Group();

    var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
				var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
				for ( var i = 0; i < 500; i ++ ) {
					var mesh = new THREE.Mesh( geometry, material );
					mesh.position.x = Math.random() * 1600 - 800;
					mesh.position.y = 0;
					mesh.position.z = Math.random() * 1600 - 800;
					mesh.updateMatrix();
					mesh.matrixAutoUpdate = false;
					sceneRoot.add( mesh );
				}

  
    //Scene graph
    scene.add(sceneRoot)
     
    // lights
    scene.add(new THREE.AmbientLight(0x222222));

    //stats
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    this.stats = stats
    this.mount.appendChild( stats.domElement );

    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    
    // controls
    var controls = new OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.panningMode = OrbitControls.HorizontalPanning; // default is THREE.ScreenSpacePanning
    controls.minDistance = 0;
    controls.maxDistance = 100000;
    controls.maxPolarAngle = Math.PI;
    controls.keys = {
      LEFT: 37, //left arrow
      UP: 38, // up arrow
      RIGHT: 39, // right arrow
      BOTTOM: 40 // down arrow
    }

    function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

    function onDocumentMouseDown( event ) {

        event.preventDefault();

        mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
        mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;

    }

    //add raycaster and mouse as 2D vector
    mouse = new THREE.Vector2();

    //add event listener for mouse and calls function when activated
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    window.addEventListener( 'resize', onWindowResize, false );
    this.mount.appendChild(this.renderer.domElement)
    this.start()
  }


  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
    this.stats.begin()
  }

  stop() {
    cancelAnimationFrame(this.frameId)
    this.stats.end()
  }

  animate() {

    //renderer
    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
    this.stats.update()
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}

export default Scene
