use wasm_bindgen::prelude::*;
use obj::{load_obj, Obj};
use serde::Serialize;
use js_sys::Uint8Array;
use std::io::{self, BufReader};

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen(module = "/foo.js")]
extern {
    #[wasm_bindgen(catch)]
    fn read_file(path: &str) -> Result<Uint8Array, JsValue>;
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {name}!"));
}

// A struct to hold the OBJ data after parsing
#[derive(Serialize)]
struct ObjData {
    vertices: Vec<[f32; 3]>,
    // normals: Vec<[f32; 3]>,
    indices: Vec<u16>,
}

// A function to convert a Uint8Array to a Vec<u8>
fn js_to_vec_u8(buffer: Uint8Array) -> Vec<u8> {
    buffer.to_vec()
}

// Convert JsValue to String for error messages
fn js_value_to_string(value: JsValue) -> String {
    if let Some(s) = value.as_string() {
        s
    } else {
        "Unknown error".to_string()
    }
}

// Function to read and parse the OBJ file
fn read_obj_file(file_path: &str) -> Result<ObjData, String> {
    let js_buffer = read_file(file_path)
        .map_err(|e| js_value_to_string(e))?; // Convert the JsValue error to a String
    let buffer = js_to_vec_u8(js_buffer); // Convert to Vec<u8>

    let cursor = io::Cursor::new(buffer); // Create a cursor for the buffer
    let reader = BufReader::new(cursor); // Create a BufReader

    let obj: Obj = load_obj(reader).map_err(|err| format!("Error reading OBJ: {}", err))?;

    let obj_data = ObjData {
        vertices: obj.vertices.iter().map(|v| v.position).collect(),
        // normals: obj.normals.iter().map(|n| n.normal).collect(),
        indices: obj.indices,
    };

    Ok(obj_data)
}

// WASM binding function to serialize the ObjData to JSON
#[wasm_bindgen]
pub fn get_obj_data(file_path: &str) -> Result<JsValue, JsValue> {
    let obj_data = read_obj_file(file_path).map_err(|err| JsValue::from_str(&err))?;
    let obj_json = serde_json::to_string(&obj_data).map_err(|err| JsValue::from_str(&format!("Error serializing OBJ: {}", err)))?;
    Ok(JsValue::from_str(&obj_json))
}
