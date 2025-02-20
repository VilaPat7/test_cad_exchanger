import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";


const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
const randomPosition = () => [(Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5];
const Primitive = ({ type, dimensions, color, position, onClick, isSelected }) => {
  const meshRef = useRef();
  const edgesRef = useRef();

  useFrame(() => {
    if (edgesRef.current) {
      edgesRef.current.position.copy(meshRef.current.position);
    }
  });

  return (
    <group position={position} onClick={onClick} scale={isSelected ? 1.2 : 1}>
      <mesh ref={meshRef}>
        {type === "box" ? (
          <boxGeometry args={[dimensions.width, dimensions.height, dimensions.length]} />
        ) : (
          <coneGeometry args={[dimensions.width / 2, dimensions.height, 4]} />
        )}
        <meshStandardMaterial color={color} />
      </mesh>

      <lineSegments ref={edgesRef}>
        <edgesGeometry attach="geometry" args={type === "box" ? [new THREE.BoxGeometry(dimensions.width, dimensions.height, dimensions.length)] : [new THREE.ConeGeometry(dimensions.width / 2, dimensions.height, 4)]} />
        <lineBasicMaterial attach="material" color="black" />
      </lineSegments>
    </group>
  );
};


const App = () => {
  const [primitives, setPrimitives] = useState([]);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("box");
  const [length, setLength] = useState(1);
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [count, setCount] = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  const addPrimitives = () => {
    const newPrimitives = Array.from({ length: count }, () => ({
      id: uuidv4(),
      type,
      dimensions: { length, width, height },
      color: randomColor(),
      position: randomPosition(),
    }));

    setPrimitives((prev) => [...prev, ...newPrimitives]);
    setOpen(false);
  };

  const clearScene = () => {
    setPrimitives([]);
    setSelectedId(null);
  };

  return (
    <Box display="flex" height="100vh" width="100vh">
      <Box width="300px" p={2} bgcolor="#f4f4f4">
        <Typography variant="h6" color="black">List of primitive groups</Typography>
        <Box mt={2}>
          {primitives.map((prim) => (
            <Box
              key={prim.id}
              p={1}
              bgcolor={prim.id === selectedId ? "#ddd" : "#fff"}
              border="1px solid #black"
              mt={1}
              onClick={() => setSelectedId(prim.id)}
              sx={{ cursor: "pointer" }}
            >
              {/* ({prim.dimensions.width}x{prim.dimensions.height}x{prim.dimensions.length}) */}
              <Typography color="black" variant="body2">{prim.type.toUpperCase()} </Typography>
              {/* <Typography color="black" variant="body2">Color: {prim.color}</Typography> */}
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: prim.color,
                  border: "1px solid black",
                  borderRadius: "4px",
                  ml: 2,
                }}
              />
              <Typography color="black" variant="body2">Pos: [{prim.position.map(p => p.toFixed(1)).join(", ")}]</Typography>
            </Box>
          ))}
        </Box>
        <Button variant="contained" onClick={() => setOpen(true)} fullWidth>Add Group</Button>
        <Button variant="contained" color="error" onClick={clearScene} fullWidth sx={{ mt: 1 }}>Clear Scene</Button>
      </Box>

      <Box bgcolor="white" flex={1}>
        <Canvas camera={{ position: [0, 3, 5] }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          {primitives.map((prim) => (
            <Primitive
              key={prim.id}
              id={prim.id}
              type={prim.type}
              dimensions={prim.dimensions}
              color={prim.color}
              position={prim.position}
              isSelected={prim.id === selectedId}
              onClick={setSelectedId}
            />
          ))}
        </Canvas>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Group</DialogTitle>
        <DialogContent>
          <Select fullWidth value={type} onChange={(e) => setType(e.target.value)} sx={{ mt: 2 }}>
            <MenuItem value="box">Box</MenuItem>
            <MenuItem value="pyramid">Pyramid</MenuItem>
          </Select>
          <TextField label="Length" type="number" fullWidth value={length} onChange={(e) => setLength(Number(e.target.value))} sx={{ mt: 2 }} />
          <TextField label="Width" type="number" fullWidth value={width} onChange={(e) => setWidth(Number(e.target.value))} sx={{ mt: 2 }} />
          <TextField label="Height" type="number" fullWidth value={height} onChange={(e) => setHeight(Number(e.target.value))} sx={{ mt: 2 }} />
          <TextField label="Count" type="number" fullWidth value={count} onChange={(e) => setCount(Number(e.target.value))} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={addPrimitives}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default App;
