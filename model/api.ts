import { Collection} from "./collection.ts"
import { Operation} from "./operation.ts"
import {Shape} from "./shape.ts"
import { memoizedProperty, property, string as stringUtil} from "./util.ts"
import { Document} from "./../types.ts"

// var Paginator = require('./paginator');
// var ResourceWaiter = require('./resource_waiter');

export function Api(api: Document = {}, options: Document={}) {
  const self: any = this;
  // api = api || {};
  // options = options || {};
  options.api = this;

  api.metadata = api.metadata || {};

  property(this, 'isApi', true, false);
  property(this, 'apiVersion', api.metadata.apiVersion);
  property(this, 'endpointPrefix', api.metadata.endpointPrefix);
  property(this, 'signingName', api.metadata.signingName);
  property(this, 'globalEndpoint', api.metadata.globalEndpoint);
  property(this, 'signatureVersion', api.metadata.signatureVersion);
  property(this, 'jsonVersion', api.metadata.jsonVersion);
  property(this, 'targetPrefix', api.metadata.targetPrefix);
  property(this, 'protocol', api.metadata.protocol);
  property(this, 'timestampFormat', api.metadata.timestampFormat);
  property(this, 'xmlNamespaceUri', api.metadata.xmlNamespace);
  property(this, 'abbreviation', api.metadata.serviceAbbreviation);
  property(this, 'fullName', api.metadata.serviceFullName);
  property(this, 'serviceId', api.metadata.serviceId);

  memoizedProperty(this, 'className', function(): string {
    let name: string = api.metadata.serviceAbbreviation || api.metadata.serviceFullName;

    if (!name) {return null;}

    name = name.replace(/^Amazon|AWS\s*|\(.*|\s+|\W+/g, '');

    if (name === 'ElasticLoadBalancing') {name = 'ELB';}

    return name;
  });

  function addEndpointOperation(name: string, operation: Document): void {
    if (operation.endpointoperation) {
      property(self, 'endpointOperation', stringUtil.lowerFirst(name));
    }
  }

  property(this, 'operations', new Collection(api.operations, options, function(name: string, operation: Document): Operation {
    return new Operation(name, operation, options);
  }, stringUtil.lowerFirst, addEndpointOperation));

  property(this, 'shapes', new Collection(api.shapes, options, function(name: string, shape:Document): any {
    return Shape.create(shape, options);
  }));

  // property(this, 'paginators', new Collection(api.paginators, options, function(name, paginator) {
  //   return new Paginator(name, paginator, options);
  // }));
  //
  // property(this, 'waiters', new Collection(api.waiters, options, function(name, waiter) {
  //   return new ResourceWaiter(name, waiter, options);
  // }, util.string.lowerFirst));

  if (options.documentation) {
    property(this, 'documentation', api.documentation);
    property(this, 'documentationUrl', api.documentationUrl);
  }
}

// /**
//  * @api private
//  */
// module.exports = Api;