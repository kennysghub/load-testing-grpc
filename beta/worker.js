const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the protobuf definition
const packageDefinition = protoLoader.loadSync('./protos/helloworld.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

// Create a gRPC client
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld
const client = await new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
console.log(client.sayHello)
// Function to make gRPC requests
async function makeGrpcRequest(requestPayload, clientMethod) {
  // Construct your request payload
  // const requestPayload = {
  //   // ... populate with request data
  //   name: 'WORKER'

  // console.log(requestPayload)
  // console.log(clientMethod)
  // Call the gRPC method
  return new Promise((resolve, reject) => {
    clientMethod(requestPayload, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}
// Main execution function
async function run(requestPayload, clientMethod) {
  // console.log(requestPayload)
  // console.log(clientMethod)
  try {
    const response = await makeGrpcRequest(requestPayload, clientMethod);
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // You can add any cleanup or additional logic here
    console.log('Done')
  }
}
// console.log(client.sayHello)
// // Run the script
if (client) {
  run({ name: "yeww" }, client.SayHello);

}
