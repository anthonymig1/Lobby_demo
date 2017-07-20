ServiceConfiguration.configurations.remove({
  service:'facebook',
});

ServiceConfiguration.configurations.insert({
  service:'facebook',
  appId:'1704974193135589',
  secret:'4f2fc9d040b57c0c9a8af3a29f029370',
});

ServiceConfiguration.configurations.remove({
  service:'twitter',
});

ServiceConfiguration.configurations.insert({
  service:'twitter',
  consumerKey:'ECARMx3iHgrJ1YkvbDIt42s6t',
  secret:'1bQo23zxzOKPujzULosgP2v6CRJQIf7jLuMMiDs5RqG5uyZkCZ',
});
ServiceConfiguration.configurations.upsert(
{ service: 'steam' },
{
  $set: {
    loginStyle: 'redirect', // THIS MUST BE SET TO REDIRECT
    timeout: 10000          // 10 seconds
  }
});
