const fs = require('fs');
const path = require('path');

// Set the base directory - change this to your desired starting directory
const baseDir = process.argv[2] || '.';

/**
 * Recursively builds a data structure that mirrors the file system structure
 * @param {string} dirPath - The directory path to scan
 * @returns {Object} - Object containing files array and directories object
 */
function buildDirectoryStructure(dirPath) {
	const result = {
		files: [],
		directories: {},
	};

	try {
		const items = fs.readdirSync(dirPath, { withFileTypes: true });

		// Get all files in current directory (excluding hidden files)
		const files = items.filter(
			(item) =>
				item.isFile() &&
				!item.name.startsWith('.') &&
				item.name.match(/\.(jpg|jpeg|png|mp4|mpg|avi)$/i)
		);

		// Get all directories (excluding hidden directories)
		const directories = items.filter(
			(item) => item.isDirectory() && !item.name.startsWith('.')
		);

		// Add files to the result
		result.files = files.map((file) => file.name).sort();

		// Recursively process directories
		for (const dir of directories) {
			const dirName = dir.name;
			const fullDirPath = path.join(dirPath, dirName);

			// Recursively build structure for this directory
			result.directories[dirName] = buildDirectoryStructure(fullDirPath);
		}
	} catch (error) {
		console.error(`Error reading directory ${dirPath}:`, error.message);
	}

	return result;
}

// Main execution
console.log(`Scanning directory: ${path.resolve(baseDir)}`);
const directoryStructure = buildDirectoryStructure(baseDir);

// Create the final data structure
const fileData = {
	baseDirectory: path.resolve(baseDir),
	scanDate: new Date().toISOString(),
	...directoryStructure,
};

// Generate the JavaScript file content
const jsContent = `// Generated on ${fileData.scanDate}
// Base directory: ${fileData.baseDirectory}

const fileData = ${JSON.stringify(fileData, null, 2)};
`;

// // Export for different module systems
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = fileData;
// }

// if (typeof window !== 'undefined') {
//     window.fileData = fileData;
// }

// // Default export for ES6
// export default fileData;

// Write to files.js
const outputPath = path.join(path.dirname(__filename), 'files.js');
try {
	fs.writeFileSync(outputPath, jsContent, 'utf8');
	console.log(`✅ File structure data written to: ${outputPath}`);
	console.log(`📁 Base directory: ${fileData.baseDirectory}`);
	console.log(`📄 Files in root: ${fileData.files.length}`);
	console.log(`📁 Subdirectories: ${Object.keys(fileData.directories).length}`);

	if (fileData.files.length > 0) {
		console.log(`\nFiles in root directory:`);
		fileData.files.forEach((file) => console.log(`  - ${file}`));
	}

	if (Object.keys(fileData.directories).length > 0) {
		console.log(`\nSubdirectories:`);
		Object.keys(fileData.directories).forEach((dir) =>
			console.log(`  - ${dir}/`)
		);
	}
} catch (error) {
	console.error('❌ Error writing files.js:', error.message);
	process.exit(1);
}

console.log('\n🎉 Directory scan completed successfully!');
