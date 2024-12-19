const THREE = require('three');
const path = require('path');
const fs = require('fs').promises;

async function loadStl(filename) {
    //const filePath = path.join(__dirname, '../', filename);
    const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader.js');

    try {
        const data = await fs.readFile(filename);
        const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
        const loader = new STLLoader();
        const bufferGeometry = loader.parse(arrayBuffer);
        return bufferGeometry;
    } catch (error) {
        throw new Error(`Ошибка чтения файла: ${error.message}`);
    }
}

function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Ошибка удаления файла:', err);
        } else {
            console.log('Файл успешно удален');
        }
    });
}


function calculateLinearDimensions(bufferGeometry) {
    const boundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(bufferGeometry));
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    /* console.log(`Ширина: ${size.x}, Высота: ${size.y}, Глубина: ${size.z}`); */
    return { width: size.x, height: size.y, depth: size.z };
}




function computeVolume(bufferGeometry) {
    let volume = 0;
    const position = bufferGeometry.attributes.position;
    if (!position) {
        console.error('У геометрии отсутствует атрибут position.');
        return 0;
    }

    const faces = position.count / 3;

    for (let i = 0; i < faces; i++) {
        const p1 = new THREE.Vector3().fromBufferAttribute(position, i * 3);
        const p2 = new THREE.Vector3().fromBufferAttribute(position, i * 3 + 1);
        const p3 = new THREE.Vector3().fromBufferAttribute(position, i * 3 + 2);

        volume += p1.dot(p2.cross(p3)) / 6.0;
    }
    /* console.log(`Объем: ${Math.abs(volume)}`); */
    return Math.round(Math.abs(volume));
}


module.exports = { loadStl, computeVolume, calculateLinearDimensions, deleteFile };