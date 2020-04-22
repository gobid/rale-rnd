// example01.js

var nodesHandle = __tracer.trackNodes();
__tracer.newNodes(nodesHandle).forEach(printNode);

function printNode(node) {
    if (node.type === 'function') {
	console.log('found a function: ' + node.name + ' at ' + node.path + ':' + node.start.line + ' with id ' + node.id);
    }
}