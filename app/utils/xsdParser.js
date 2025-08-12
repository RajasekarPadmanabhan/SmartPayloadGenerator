import { XMLParser } from 'fast-xml-parser';

class XSDParser {
  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      parseAttributeValue: true,
      ignoreNameSpace: false,
      removeNSPrefix: false,
      parseTagValue: false
    });
  }

  async parse(xsdContent) {
    try {
      console.log('Parsing XSD content...');
      const parsed = this.parser.parse(xsdContent);
      console.log('Parsed XSD:', JSON.stringify(parsed, null, 2));
      
      const schema = parsed['xs:schema'] || parsed.schema;
      
      if (!schema) {
        throw new Error('Invalid XSD schema: No schema element found');
      }

      const result = this.parseSchema(schema);
      console.log('Parsed schema structure:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('XSD Parsing error:', error);
      throw new Error(`Failed to parse XSD schema: ${error.message}`);
    }
  }

  parseSchema(schema) {
    const elements = [];
    const complexTypes = {};
    
    console.log('Starting schema parsing...');
    
    // Parse complex types first
    if (schema['xs:complexType']) {
      const complexTypeArray = Array.isArray(schema['xs:complexType']) 
        ? schema['xs:complexType'] 
        : [schema['xs:complexType']];
      
      console.log(`Found ${complexTypeArray.length} complex types to parse`);
      
      complexTypeArray.forEach(complexType => {
        const name = complexType['@_name'];
        if (name) {
          console.log(`Parsing complex type: ${name}`);
          complexTypes[name] = this.parseComplexType(complexType, name, complexTypes);
        }
      });
    }

    console.log('Complex types parsed:', Object.keys(complexTypes));

    // Parse root elements
    if (schema['xs:element']) {
      const elementArray = Array.isArray(schema['xs:element']) 
        ? schema['xs:element'] 
        : [schema['xs:element']];
      
      console.log(`Found ${elementArray.length} root elements to parse`);
      
      elementArray.forEach(element => {
        const parsedElement = this.parseElement(element, complexTypes);
        elements.push(parsedElement);
        console.log(`Parsed root element: ${parsedElement.name}`);
      });
    }

    // Resolve unresolved type references
    this.resolveTypeReferences(elements, complexTypes);

    console.log('Schema parsing complete');
    return {
      elements,
      complexTypes,
      targetNamespace: schema['@_targetNamespace'] || ''
    };
  }

  resolveTypeReferences(elements, complexTypes) {
    console.log('Resolving type references...');
    
    const resolveElement = (element) => {
      if (element.unresolvedType && complexTypes[element.unresolvedType]) {
        console.log(`Resolving type reference: ${element.unresolvedType} for element: ${element.name}`);
        element.children = complexTypes[element.unresolvedType].children;
        element.type = 'complex';
        delete element.unresolvedType;
      }
      
      // Recursively resolve children
      if (element.children) {
        element.children.forEach(child => resolveElement(child));
      }
    };

    elements.forEach(element => resolveElement(element));
  }

  parseElement(element, complexTypes = {}, parentName = '') {
    const name = element['@_name'];
    const type = element['@_type'];
    const minOccurs = element['@_minOccurs'] || '1';
    const maxOccurs = element['@_maxOccurs'] || '1';

    console.log(`Parsing element: ${name}, type: ${type}, parent: ${parentName}`);

    const parsedElement = {
      name,
      type: type || 'complex',
      minOccurs,
      maxOccurs,
      children: []
    };

    // Handle inline complex type
    if (element['xs:complexType']) {
      console.log(`Found inline complex type for element: ${name}`);
      const complexType = this.parseComplexType(element['xs:complexType'], name, complexTypes);
      parsedElement.children = complexType.children;
      parsedElement.type = 'complex';
    }
    // Handle reference to named complex type
    else if (type && complexTypes[type]) {
      console.log(`Found reference to named complex type: ${type}`);
      parsedElement.children = complexTypes[type].children;
      parsedElement.type = 'complex';
    }
    // Handle built-in XSD types  
    else if (type && this.isBuiltInType(type)) {
      parsedElement.type = this.mapXSDTypeToSimpleType(type);
      console.log(`Mapped built-in type: ${type} -> ${parsedElement.type}`);
    }
    // Handle custom named types that might not be resolved yet
    else if (type) {
      console.log(`Found unresolved type reference: ${type}, marking as complex for later resolution`);
      parsedElement.type = 'complex';
      parsedElement.unresolvedType = type;
    }

    return parsedElement;
  }

  isBuiltInType(type) {
    const builtInTypes = [
      'xs:string', 'xs:int', 'xs:integer', 'xs:decimal', 'xs:boolean', 'xs:date', 
      'xs:dateTime', 'xs:time', 'xs:double', 'xs:float', 'xs:long', 'xs:short',
      'xs:byte', 'xs:unsignedLong', 'xs:unsignedInt', 'xs:unsignedShort',
      'xs:unsignedByte', 'xs:positiveInteger', 'xs:negativeInteger',
      'xs:nonNegativeInteger', 'xs:nonPositiveInteger', 'xs:anyURI'
    ];
    return builtInTypes.includes(type);
  }

  parseComplexType(complexType, parentName = '', complexTypes = {}) {
    const children = [];
    
    console.log(`Parsing complex type for parent: ${parentName}`);
    
    // Handle sequence
    if (complexType['xs:sequence']) {
      const sequence = complexType['xs:sequence'];
      console.log('Found xs:sequence');
      
      if (sequence['xs:element']) {
        const elementArray = Array.isArray(sequence['xs:element']) 
          ? sequence['xs:element'] 
          : [sequence['xs:element']];
        
        console.log(`Found ${elementArray.length} elements in sequence`);
        
        elementArray.forEach(element => {
          const childElement = this.parseElement(element, complexTypes, parentName);
          children.push(childElement);
          console.log(`Added child element: ${childElement.name} of type: ${childElement.type}`);
        });
      }
    }

    // Handle choice
    if (complexType['xs:choice']) {
      const choice = complexType['xs:choice'];
      console.log('Found xs:choice');
      
      if (choice['xs:element']) {
        const elementArray = Array.isArray(choice['xs:element']) 
          ? choice['xs:element'] 
          : [choice['xs:element']];
        
        elementArray.forEach(element => {
          children.push(this.parseElement(element, complexTypes, parentName));
        });
      }
    }

    // Handle all
    if (complexType['xs:all']) {
      const all = complexType['xs:all'];
      console.log('Found xs:all');
      
      if (all['xs:element']) {
        const elementArray = Array.isArray(all['xs:element']) 
          ? all['xs:element'] 
          : [all['xs:element']];
        
        elementArray.forEach(element => {
          children.push(this.parseElement(element, complexTypes, parentName));
        });
      }
    }

    console.log(`Complex type parsing complete. Found ${children.length} children`);
    return { children };
  }

  mapXSDTypeToSimpleType(xsdType) {
    // Remove namespace prefix if present
    const type = xsdType.replace(/^xs:/, '').replace(/^xsd:/, '');
    
    switch (type) {
      case 'string':
      case 'normalizedString':
      case 'token':
      case 'language':
      case 'NMTOKEN':
      case 'Name':
      case 'NCName':
      case 'ID':
      case 'IDREF':
      case 'ENTITY':
        return 'string';
        
      case 'int':
      case 'integer':
      case 'positiveInteger':
      case 'negativeInteger':
      case 'nonNegativeInteger':
      case 'nonPositiveInteger':
      case 'long':
      case 'short':
      case 'byte':
      case 'unsignedLong':
      case 'unsignedInt':
      case 'unsignedShort':
      case 'unsignedByte':
        return 'integer';
        
      case 'decimal':
      case 'float':
      case 'double':
        return 'decimal';
        
      case 'boolean':
        return 'boolean';
        
      case 'date':
      case 'dateTime':
      case 'time':
      case 'gYear':
      case 'gYearMonth':
      case 'gMonth':
      case 'gMonthDay':
      case 'gDay':
        return 'date';
        
      case 'anyURI':
        return 'uri';
        
      case 'base64Binary':
      case 'hexBinary':
        return 'binary';
        
      default:
        return 'string';
    }
  }
}

export default XSDParser;
