class PayloadGenerator {
  constructor() {
    this.sampleData = {
      names: [
        'John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson',
        'Lisa Anderson', 'James Taylor', 'Jennifer Martinez', 'Robert Garcia', 'Mary Rodriguez',
        'Christopher Lee', 'Jessica White', 'Matthew Martin', 'Ashley Thompson', 'Daniel Jackson',
        'Amanda Miller', 'Kevin Moore', 'Rachel Green', 'Steven Clark', 'Nicole Lewis'
      ],
      firstNames: [
        'John', 'Emma', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Jennifer', 'Robert', 'Mary',
        'Christopher', 'Jessica', 'Matthew', 'Ashley', 'Daniel', 'Amanda', 'Kevin', 'Rachel', 'Steven', 'Nicole'
      ],
      lastNames: [
        'Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Martinez', 'Garcia', 'Rodriguez',
        'Lee', 'White', 'Martin', 'Thompson', 'Jackson', 'Miller', 'Moore', 'Green', 'Clark', 'Lewis'
      ],
      companies: [
        'Global Logistics Inc', 'Express Delivery Corp', 'Prime Shipping Solutions', 'FastTrack Distribution',
        'Worldwide Express', 'Rapid Transit Co', 'Elite Freight Services', 'Supreme Logistics',
        'NextGen Shipping', 'Advanced Distribution Systems', 'Premier Cargo Solutions', 'Metro Business Group',
        'International Trade Corp', 'Regional Partners LLC', 'Central Commerce Inc'
      ],
      products: [
        'Wireless Headphones', 'Smartphone Case', 'Laptop Charger', 'Bluetooth Speaker', 'USB Cable',
        'Power Bank', 'Tablet Stand', 'Wireless Mouse', 'Keyboard Cover', 'Monitor Stand',
        'Desktop Organizer', 'Cable Management Kit', 'Phone Holder', 'Laptop Bag', 'Screen Protector',
        'Gaming Controller', 'External Hard Drive', 'Webcam', 'Microphone', 'LED Light Strip'
      ],
      streets: [
        'Main Street', 'Oak Avenue', 'Park Road', 'First Street', 'Second Avenue', 'Business Boulevard',
        'Industrial Way', 'Commerce Drive', 'Market Street', 'Broadway', 'Central Avenue', 'Pine Street',
        'Maple Lane', 'Cedar Court', 'Elm Drive', 'Washington Street', 'Lincoln Avenue', 'Roosevelt Road'
      ],
      cities: [
        'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
        'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus',
        'Charlotte', 'Seattle', 'Denver', 'Boston', 'Nashville', 'Detroit'
      ],
      countries: ['United States', 'Canada', 'Germany', 'United Kingdom', 'France', 'Australia', 'Japan', 'Netherlands', 'Spain', 'Italy'],
      countryCodes: ['US', 'CA', 'DE', 'GB', 'FR', 'AU', 'JP', 'NL', 'ES', 'IT'],
      currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK'],
      statuses: ['Active', 'Pending', 'Completed', 'In Progress', 'Delivered', 'Confirmed', 'Processing', 'Shipped', 'Cancelled', 'On Hold'],
      types: ['Standard', 'Express', 'Priority', 'Regular', 'Special', 'Premium', 'Economy', 'Urgent', 'Next Day'],
      departments: ['Sales', 'Marketing', 'Operations', 'Finance', 'IT', 'Human Resources', 'Logistics', 'Customer Service', 'Quality Assurance'],
      industries: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Transportation', 'Energy', 'Construction'],
      titles: ['Mr.', 'Ms.', 'Dr.', 'Prof.', 'Mrs.', 'Rev.', 'Sir', 'Dame'],
      priorities: ['Low', 'Medium', 'High', 'Critical', 'Urgent'],
      conditions: ['New', 'Used', 'Refurbished', 'Damaged', 'Perfect', 'Good', 'Fair'],
      colors: ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Gray', 'Silver', 'Gold', 'Purple']
    };
  }

  generate(schema, filterCondition = '', outputFormat = 'json') {
    if (!schema || !schema.elements || schema.elements.length === 0) {
      throw new Error('Invalid schema: No elements found');
    }

    console.log('Generating payload for schema:', schema);
    console.log('Filter condition:', filterCondition);

    // Parse filter condition
    const filters = this.parseFilterCondition(filterCondition);
    console.log('Parsed filters:', filters);
    
    // Generate data for the root element
    const rootElement = schema.elements[0];
    console.log('Root element:', rootElement);
    
    const data = this.generateElementData(rootElement, filters);
    console.log('Generated data structure:', data);

    // Create the final payload structure
    const payload = {
      [rootElement.name]: data
    };

    console.log('Final payload before formatting:', payload);

    // Format output
    if (outputFormat === 'xml') {
      return this.formatAsXML(payload, rootElement.name);
    } else {
      return JSON.stringify(payload, null, 2);
    }
  }

  parseFilterCondition(filterCondition) {
    if (!filterCondition.trim()) {
      return {};
    }

    console.log('Parsing complex filter condition:', filterCondition);
    
    // Parse complex XPath-like filter conditions
    const filters = {
      constraints: [],
      isComplex: true
    };
    
    // Check if it's a simple condition (backwards compatibility)
    if (!filterCondition.includes('$Start') && !filterCondition.includes('ns21:') && !filterCondition.includes('not(')) {
      return this.parseSimpleFilterCondition(filterCondition);
    }
    
    // Parse complex XPath conditions
    this.parseXPathFilter(filterCondition, filters);
    
    console.log('Parsed complex filters:', filters);
    return filters;
  }

  parseSimpleFilterCondition(filterCondition) {
    const filters = {};
    const conditions = filterCondition.split(/\s+and\s+/i);
    
    conditions.forEach(condition => {
      const trimmed = condition.trim();
      
      // Handle different operators
      if (trimmed.includes('<=')) {
        const [field, value] = trimmed.split('<=').map(s => s.trim());
        filters[field.replace(/['"]/g, '')] = { operator: '<=', value: this.parseValue(value) };
      } else if (trimmed.includes('>=')) {
        const [field, value] = trimmed.split('>=').map(s => s.trim());
        filters[field.replace(/['"]/g, '')] = { operator: '>=', value: this.parseValue(value) };
      } else if (trimmed.includes('<')) {
        const [field, value] = trimmed.split('<').map(s => s.trim());
        filters[field.replace(/['"]/g, '')] = { operator: '<', value: this.parseValue(value) };
      } else if (trimmed.includes('>')) {
        const [field, value] = trimmed.split('>').map(s => s.trim());
        filters[field.replace(/['"]/g, '')] = { operator: '>', value: this.parseValue(value) };
      } else if (trimmed.includes('!=')) {
        const [field, value] = trimmed.split('!=').map(s => s.trim());
        filters[field.replace(/['"]/g, '')] = { operator: '!=', value: this.parseValue(value) };
      } else if (trimmed.includes('=')) {
        const [field, value] = trimmed.split('=').map(s => s.trim());
        filters[field.replace(/['"]/g, '')] = { operator: '=', value: this.parseValue(value) };
      }
    });

    return filters;
  }

  parseXPathFilter(filterCondition, filters) {
    // Extract specific constraints from the XPath expression
    
    // 1. DeliveryType constraint: not(DeliveryType='ZLR' or DeliveryType='ZRET')
    // This means DeliveryType should NOT be 'ZLR' or 'ZRET'
    if (filterCondition.includes("DeliveryType='ZLR'") || filterCondition.includes("DeliveryType='ZRET'")) {
      filters.constraints.push({
        path: 'Delivery.DeliveryHeader.DeliveryType',
        operator: 'not_in',
        values: ['ZLR', 'ZRET']
      });
    }
    
    // 2. ParentDeliveryNumber constraint: string-length(ParentDeliveryNumber)=0
    // This means ParentDeliveryNumber should be empty
    if (filterCondition.includes('ParentDeliveryNumber') && filterCondition.includes('string-length') && filterCondition.includes('=0')) {
      filters.constraints.push({
        path: 'Delivery.DeliveryHeader.ParentDeliveryNumber',
        operator: 'empty',
        value: ''
      });
    }
    
    // 3. DistributionCenter constraint: DistributionCenter=('5550','5560')
    // This means DistributionCenter should be '5550' or '5560'
    const distCenterMatch = filterCondition.match(/DistributionCenter=\('([^']+)','([^']+)'\)/);
    if (distCenterMatch) {
      filters.constraints.push({
        path: 'Delivery.DeliveryItemList.DeliveryItem.DistributionCenter',
        operator: 'in',
        values: [distCenterMatch[1], distCenterMatch[2]]
      });
    }
    
    // 4. StorageLocation constraint: StorageLocation='0001'
    // This means StorageLocation should be '0001'
    const storageMatch = filterCondition.match(/StorageLocation='([^']+)'/);
    if (storageMatch) {
      filters.constraints.push({
        path: 'Delivery.DeliveryItemList.DeliveryItem.StorageLocation',
        operator: 'equals',
        value: storageMatch[1]
      });
    }
    
    // 5. Event constraint: count(Event[@eventID=('YADI001',...)])=0
    // This means there should be NO events with these IDs
    if (filterCondition.includes('Event[@eventID=') && filterCondition.includes('count(') && filterCondition.includes('=0')) {
      const eventMatch = filterCondition.match(/Event\[@eventID=\('([^)]+)'\)\]/);
      if (eventMatch) {
        const eventIds = eventMatch[1].split("','");
        filters.constraints.push({
          path: 'Delivery.DeliveryHeader.EventList.Event',
          operator: 'no_events_with_ids',
          values: eventIds
        });
      }
    }
  }

  parseValue(value) {
    const trimmed = value.trim().replace(/['"]/g, '');
    
    if (trimmed.toLowerCase() === 'true') return true;
    if (trimmed.toLowerCase() === 'false') return false;
    if (!isNaN(trimmed) && !isNaN(parseFloat(trimmed))) return parseFloat(trimmed);
    
    return trimmed;
  }

  generateElementData(element, filters = {}, currentPath = '') {
    console.log(`Generating data for element: ${element.name}, type: ${element.type}, children: ${element.children?.length || 0}`);
    
    // Build current path for complex filter matching
    const elementPath = currentPath ? `${currentPath}.${element.name}` : element.name;
    console.log(`Current element path: ${elementPath}`);
    
    // Handle optional elements (minOccurs="0") - generate them with 70% probability
    if (element.minOccurs === '0' && Math.random() < 0.3) {
      console.log(`Skipping optional element: ${element.name} (minOccurs=0)`);
      return undefined;
    }
    
    if (element.type === 'complex' && element.children && element.children.length > 0) {
      console.log(`Processing complex element: ${element.name} with ${element.children.length} children`);
      
      // For elements that can occur multiple times
      if (element.maxOccurs === 'unbounded' || parseInt(element.maxOccurs) > 1) {
        console.log(`Element ${element.name} can occur multiple times (maxOccurs: ${element.maxOccurs})`);
        const count = Math.min(3, parseInt(element.maxOccurs) || 3); // Generate 3 items by default
        const items = [];
        
        for (let i = 0; i < count; i++) {
          const item = this.generateComplexElementWithFilters(element, filters, elementPath);
          items.push(item);
        }
        
        console.log(`Generated ${items.length} items for ${element.name}`);
        return items;
      } else {
        // Single occurrence
        console.log(`Processing single occurrence element: ${element.name}`);
        return this.generateComplexElementWithFilters(element, filters, elementPath);
      }
    } else {
      // Simple type - check for complex filters
      console.log(`Generating simple value for: ${element.name}, type: ${element.type}`);
      return this.generateValueWithComplexFilters(element.name, element.type, filters, elementPath);
    }
  }

  generateComplexElementWithFilters(element, filters, elementPath) {
    const item = {};
    
    // Special handling for EventList when we have event constraints
    if (element.name === 'EventList' && filters.isComplex && filters.constraints) {
      const eventConstraint = filters.constraints.find(c => c.operator === 'no_events_with_ids');
      if (eventConstraint) {
        console.log('EventList constraint found - generating empty EventList or events with allowed IDs only');
        // Generate either empty EventList or events with allowed IDs
        const allowedEventIds = ['YCOM001', 'YCOM002', 'YCOM003', 'YSHP001', 'YSHP002'];
        const forbiddenEventIds = eventConstraint.values;
        const validEventIds = allowedEventIds.filter(id => !forbiddenEventIds.includes(id));
        
        if (validEventIds.length > 0 && Math.random() > 0.7) { // 30% chance of having events
          const eventCount = Math.floor(Math.random() * 2) + 1; // 1-2 events
          const events = [];
          for (let i = 0; i < eventCount; i++) {
            events.push({
              eventID: this.getRandomItem(validEventIds),
              eventDate: this.generateDateValue(),
              eventDescription: 'System generated event'
            });
          }
          item.Event = events;
        } else {
          // Return empty EventList or don't include Event at all
          return {};
        }
        return item;
      }
    }
    
    element.children.forEach(child => {
      console.log(`Processing child: ${child.name} with maxOccurs: ${child.maxOccurs}`);
      const childData = this.generateElementData(child, filters, elementPath);
      if (childData !== undefined) {
        item[child.name] = childData;
      }
    });
    
    return item;
  }

  generateValueWithComplexFilters(fieldName, type, filters, currentPath) {
    // Check if we have complex filters
    if (filters.isComplex && filters.constraints) {
      return this.generateValueForComplexFilters(fieldName, type, filters.constraints, currentPath);
    }
    
    // Check for simple filters (backwards compatibility)
    if (filters[fieldName]) {
      return this.generateValueForFilter(fieldName, type, filters[fieldName]);
    }
    
    // Generate normal value
    return this.generateSimpleValue(fieldName, type, filters);
  }

  generateValueForComplexFilters(fieldName, type, constraints, currentPath) {
    console.log(`Checking complex filters for ${fieldName} at path ${currentPath}`);
    
    // Find matching constraints for this field path
    const matchingConstraint = constraints.find(constraint => {
      const constraintPath = constraint.path.replace(/^Delivery\./, ''); // Remove prefix if present
      const normalizedCurrentPath = currentPath.replace(/^Delivery\./, '');
      return constraintPath.endsWith(fieldName) || 
             normalizedCurrentPath.endsWith(constraintPath.split('.').pop());
    });
    
    if (matchingConstraint) {
      console.log(`Found matching constraint for ${fieldName}:`, matchingConstraint);
      
      switch (matchingConstraint.operator) {
        case 'not_in':
          // Generate a value that is NOT in the specified values
          const allowedValues = ['ZNF', 'ZORD', 'ZCAN', 'ZNEW', 'ZUPD']; // Alternative delivery types
          const forbiddenValues = matchingConstraint.values;
          const validValues = allowedValues.filter(val => !forbiddenValues.includes(val));
          return this.getRandomItem(validValues);
          
        case 'empty':
          // Return empty string
          return '';
          
        case 'in':
          // Return one of the specified values
          return this.getRandomItem(matchingConstraint.values);
          
        case 'equals':
          // Return the exact value
          return matchingConstraint.value;
          
        case 'no_events_with_ids':
          // For Event elements, don't generate events with forbidden IDs
          // This is handled at the structure level, so generate empty array or null
          return null;
          
        default:
          break;
      }
    }
    
    // If no specific constraint, generate normal value
    return this.generateSimpleValue(fieldName, type);
  }

  generateFilteredData(children, filters) {
    const item = {};
    
    children.forEach(child => {
      if (filters[child.name]) {
        // Generate value that matches the filter
        item[child.name] = this.generateValueForFilter(child.name, child.type, filters[child.name]);
      } else {
        item[child.name] = this.generateElementData(child, filters);
      }
    });
    
    return item;
  }

  generateValueForFilter(fieldName, type, filter) {
    const { operator, value } = filter;
    
    switch (operator) {
      case '=':
        return value;
      case '!=':
        return type === 'boolean' ? !value : (typeof value === 'string' ? 'different_value' : value + 1);
      case '<':
        return type === 'decimal' || type === 'integer' ? 
          Math.max(0, value - Math.random() * value) : 
          this.generateSimpleValue(fieldName, type);
      case '<=':
        return type === 'decimal' || type === 'integer' ? 
          Math.max(0, value - Math.random() * (value * 0.1)) : 
          this.generateSimpleValue(fieldName, type);
      case '>':
        return type === 'decimal' || type === 'integer' ? 
          value + Math.random() * value : 
          this.generateSimpleValue(fieldName, type);
      case '>=':
        return type === 'decimal' || type === 'integer' ? 
          value + Math.random() * (value * 0.1) : 
          this.generateSimpleValue(fieldName, type);
      default:
        return this.generateSimpleValue(fieldName, type);
    }
  }

  matchesFilters(item, filters) {
    for (const [field, filter] of Object.entries(filters)) {
      if (item[field] !== undefined) {
        const value = item[field];
        const { operator, value: filterValue } = filter;
        
        switch (operator) {
          case '=':
            if (value !== filterValue) return false;
            break;
          case '!=':
            if (value === filterValue) return false;
            break;
          case '<':
            if (value >= filterValue) return false;
            break;
          case '<=':
            if (value > filterValue) return false;
            break;
          case '>':
            if (value <= filterValue) return false;
            break;
          case '>=':
            if (value < filterValue) return false;
            break;
        }
      }
    }
    return true;
  }

  generateSimpleValue(fieldName, type, filters = {}) {
    const lowerFieldName = fieldName.toLowerCase();
    
    // Check if there's a filter for this field
    if (filters[fieldName]) {
      return this.generateValueForFilter(fieldName, type, filters[fieldName]);
    }
    
    switch (type) {
      case 'string':
        return this.generateStringValue(lowerFieldName);
      case 'integer':
        return this.generateIntegerValue(lowerFieldName);
      case 'decimal':
        return this.generateDecimalValue(lowerFieldName);
      case 'boolean':
        return Math.random() > 0.5;
      case 'date':
        return this.generateDateValue();
      default:
        return this.generateStringValue(lowerFieldName);
    }
  }

  generateStringValue(fieldName) {
    const lowerFieldName = fieldName.toLowerCase();
    
    // Handle various field types based on common naming patterns
    if (lowerFieldName.includes('name')) {
      if (lowerFieldName.includes('product') || lowerFieldName.includes('item') || lowerFieldName.includes('article')) {
        return this.getRandomItem(this.sampleData.products);
      } else if (lowerFieldName.includes('company') || lowerFieldName.includes('partner') || lowerFieldName.includes('organization')) {
        return this.getRandomItem(this.sampleData.companies);
      } else if (lowerFieldName.includes('first') || lowerFieldName.includes('given')) {
        return this.getRandomItem(this.sampleData.firstNames);
      } else if (lowerFieldName.includes('last') || lowerFieldName.includes('family') || lowerFieldName.includes('surname')) {
        return this.getRandomItem(this.sampleData.lastNames);
      } else if (lowerFieldName.includes('care') || lowerFieldName.includes('contact')) {
        return this.getRandomItem(this.sampleData.names);
      } else {
        return this.getRandomItem(this.sampleData.names);
      }
    }
    
    if (lowerFieldName.includes('number') || lowerFieldName.includes('no') || lowerFieldName.includes('nbr')) {
      if (lowerFieldName.includes('delivery')) {
        return 'DN' + this.generateRandomNumber(8);
      } else if (lowerFieldName.includes('parent')) {
        // For ParentDeliveryNumber - often should be empty based on filters
        return ''; // Will be overridden by filters if needed
      } else if (lowerFieldName.includes('order') || lowerFieldName.includes('sales')) {
        return 'SO' + this.generateRandomNumber(8);
      } else if (lowerFieldName.includes('invoice')) {
        return 'INV' + this.generateRandomNumber(7);
      } else if (lowerFieldName.includes('phone') || lowerFieldName.includes('fax')) {
        return this.generatePhoneNumber();
      } else if (lowerFieldName.includes('house') || lowerFieldName.includes('street')) {
        return Math.floor(Math.random() * 999 + 1).toString();
      } else if (lowerFieldName.includes('article') || lowerFieldName.includes('material') || lowerFieldName.includes('sku')) {
        return 'ART' + this.generateRandomNumber(6);
      } else if (lowerFieldName.includes('reference') || lowerFieldName.includes('ref')) {
        return 'REF' + this.generateRandomNumber(8);
      } else if (lowerFieldName.includes('tracking') || lowerFieldName.includes('bol')) {
        return 'TRK' + this.generateRandomNumber(10);
      } else if (lowerFieldName.includes('account')) {
        return 'ACC' + this.generateRandomNumber(8);
      } else {
        return this.generateRandomNumber(8);
      }
    }
    
    // Handle delivery-specific field types
    if (lowerFieldName.includes('deliverytype') || lowerFieldName.includes('delivery_type')) {
      // Default delivery types that are NOT ZLR or ZRET
      const deliveryTypes = ['ZNF', 'ZORD', 'ZCAN', 'ZNEW', 'ZUPD', 'ZSTD'];
      return this.getRandomItem(deliveryTypes);
    }
    
    if (lowerFieldName.includes('distributioncenter') || lowerFieldName.includes('distribution_center')) {
      // Generate distribution center codes
      const distributionCenters = ['5550', '5560', '5570', '5580', '5590'];
      return this.getRandomItem(distributionCenters);
    }
    
    if (lowerFieldName.includes('storagelocation') || lowerFieldName.includes('storage_location')) {
      // Generate storage location codes
      const storageLocations = ['0001', '0002', '0003', '0010', '0020'];
      return this.getRandomItem(storageLocations);
    }
    
    if (lowerFieldName.includes('eventid') || lowerFieldName.includes('event_id')) {
      // Generate event IDs that are NOT in the forbidden list
      const allowedEventIds = ['YCOM001', 'YCOM002', 'YCOM003', 'YSHP001', 'YSHP002', 'YPCK001', 'YPCK002'];
      return this.getRandomItem(allowedEventIds);
    }
    
    if (lowerFieldName.includes('email')) {
      return this.generateEmail();
    }
    
    if (lowerFieldName.includes('address') || lowerFieldName.includes('street')) {
      return this.generateAddress();
    }
    
    if (lowerFieldName.includes('city')) {
      return this.getRandomItem(this.sampleData.cities);
    }
    
    if (lowerFieldName.includes('country')) {
      if (lowerFieldName.includes('code')) {
        return this.getRandomItem(this.sampleData.countryCodes);
      } else {
        return this.getRandomItem(this.sampleData.countries);
      }
    }
    
    if (lowerFieldName.includes('code') || lowerFieldName.includes('cd')) {
      if (lowerFieldName.includes('post') || lowerFieldName.includes('zip')) {
        return this.generatePostalCode();
      } else if (lowerFieldName.includes('region') || lowerFieldName.includes('state')) {
        return this.getRandomItem(['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI']);
      } else if (lowerFieldName.includes('currency')) {
        return this.getRandomItem(this.sampleData.currencies);
      } else if (lowerFieldName.includes('size')) {
        return this.getRandomItem(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
      } else if (lowerFieldName.includes('brand') || lowerFieldName.includes('product')) {
        return this.generateRandomCode(3);
      } else {
        return this.generateRandomCode(Math.floor(Math.random() * 4) + 3); // 3-6 character codes
      }
    }
    
    if (lowerFieldName.includes('status')) {
      return this.getRandomItem(this.sampleData.statuses);
    }
    
    if (lowerFieldName.includes('type')) {
      return this.getRandomItem(this.sampleData.types);
    }
    
    if (lowerFieldName.includes('currency')) {
      return this.getRandomItem(this.sampleData.currencies);
    }
    
    if (lowerFieldName.includes('description') || lowerFieldName.includes('desc') || lowerFieldName.includes('text')) {
      return this.generateDescription(fieldName);
    }
    
    if (lowerFieldName.includes('id') || lowerFieldName.includes('identifier')) {
      return this.generateRandomCode(8);
    }
    
    if (lowerFieldName.includes('title')) {
      const titles = ['Mr.', 'Ms.', 'Dr.', 'Prof.', 'Mrs.'];
      return this.getRandomItem(titles);
    }
    
    if (lowerFieldName.includes('indicator') || lowerFieldName.includes('flag')) {
      return this.getRandomItem(['Y', 'N', 'X', '1', '0']);
    }
    
    if (lowerFieldName.includes('division') || lowerFieldName.includes('department')) {
      return this.getRandomItem(this.sampleData.departments);
    }
    
    if (lowerFieldName.includes('unit') || lowerFieldName.includes('uom')) {
      return this.getRandomItem(['EA', 'PC', 'KG', 'LB', 'M', 'FT', 'L', 'GAL']);
    }
    
    // Default realistic values based on context
    return this.generateGenericValue(fieldName);
  }
  
  generateRandomNumber(length) {
    return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
  }
  
  generateRandomCode(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  generatePhoneNumber() {
    const formats = [
      () => `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      () => `(${Math.floor(Math.random() * 900 + 100)}) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      () => `${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 9000 + 1000)}`
    ];
    return this.getRandomItem(formats)();
  }
  
  generateEmail() {
    const domains = ['company.com', 'business.org', 'enterprise.net', 'corp.com', 'global.com'];
    const users = ['contact', 'info', 'sales', 'support', 'admin', 'service'];
    const user = this.getRandomItem(users) + Math.floor(Math.random() * 100);
    return `${user}@${this.getRandomItem(domains)}`;
  }
  
  generateAddress() {
    const number = Math.floor(Math.random() * 9999 + 1);
    const street = this.getRandomItem(this.sampleData.streets);
    return `${number} ${street}`;
  }
  
  generatePostalCode() {
    const formats = [
      () => Math.floor(Math.random() * 90000 + 10000).toString(), // US format
      () => Math.random().toString(36).substring(2, 4).toUpperCase() + Math.floor(Math.random() * 90 + 10), // CA format
      () => Math.floor(Math.random() * 90000 + 10000).toString() + '-' + Math.floor(Math.random() * 9000 + 1000) // Extended format
    ];
    return this.getRandomItem(formats)();
  }
  
  generateDescription(fieldName) {
    const lowerFieldName = fieldName.toLowerCase();
    
    if (lowerFieldName.includes('product') || lowerFieldName.includes('item')) {
      const adjectives = ['High-quality', 'Premium', 'Standard', 'Professional', 'Commercial', 'Industrial'];
      const products = ['equipment', 'component', 'device', 'tool', 'accessory', 'part'];
      return `${this.getRandomItem(adjectives)} ${this.getRandomItem(products)}`;
    }
    
    if (lowerFieldName.includes('delivery') || lowerFieldName.includes('shipping')) {
      const descriptions = [
        'Express delivery service', 'Standard shipping method', 'Priority handling required',
        'Special packaging needed', 'Fragile items included', 'Rush order processing'
      ];
      return this.getRandomItem(descriptions);
    }
    
    if (lowerFieldName.includes('reason') || lowerFieldName.includes('comment')) {
      const reasons = [
        'Customer request', 'Inventory adjustment', 'Quality control check',
        'Special instructions', 'Expedited processing', 'Standard procedure'
      ];
      return this.getRandomItem(reasons);
    }
    
    const genericDescriptions = [
      'Processing required', 'Standard handling', 'Quality verified',
      'Inspection complete', 'Documentation attached', 'Approved for shipment'
    ];
    return this.getRandomItem(genericDescriptions);
  }
  
  generateGenericValue(fieldName) {
    // Generate contextual values based on field name patterns
    const lowerFieldName = fieldName.toLowerCase();
    
    if (lowerFieldName.includes('key') || lowerFieldName.includes('value')) {
      return this.generateRandomCode(6);
    }
    
    if (lowerFieldName.includes('version') || lowerFieldName.includes('level')) {
      return Math.floor(Math.random() * 10 + 1).toString();
    }
    
    if (lowerFieldName.includes('category') || lowerFieldName.includes('class')) {
      const categories = ['A', 'B', 'C', 'Standard', 'Premium', 'Basic'];
      return this.getRandomItem(categories);
    }
    
    // Default to a meaningful identifier
    return this.generateRandomCode(6);
  }

  generateIntegerValue(fieldName) {
    const lowerFieldName = fieldName.toLowerCase();
    
    if (lowerFieldName.includes('age')) {
      return Math.floor(Math.random() * 50) + 20; // 20-70
    }
    
    if (lowerFieldName.includes('year')) {
      return Math.floor(Math.random() * 30) + 1995; // 1995-2025
    }
    
    if (lowerFieldName.includes('count') || lowerFieldName.includes('number')) {
      if (lowerFieldName.includes('line') || lowerFieldName.includes('item')) {
        return Math.floor(Math.random() * 20) + 1; // 1-20
      } else if (lowerFieldName.includes('total') || lowerFieldName.includes('sum')) {
        return Math.floor(Math.random() * 1000) + 100; // 100-1100
      }
    }
    
    if (lowerFieldName.includes('quantity') || lowerFieldName.includes('qty')) {
      if (lowerFieldName.includes('ordered') || lowerFieldName.includes('confirmed')) {
        return Math.floor(Math.random() * 100) + 1; // 1-100
      } else if (lowerFieldName.includes('carton') || lowerFieldName.includes('case')) {
        return Math.floor(Math.random() * 50) + 1; // 1-50
      } else {
        return Math.floor(Math.random() * 500) + 1; // 1-500
      }
    }
    
    if (lowerFieldName.includes('index') || lowerFieldName.includes('level')) {
      return Math.floor(Math.random() * 10) + 1; // 1-10
    }
    
    if (lowerFieldName.includes('time') && (lowerFieldName.includes('processing') || lowerFieldName.includes('lead'))) {
      return Math.floor(Math.random() * 48) + 1; // 1-48 hours
    }
    
    if (lowerFieldName.includes('days')) {
      return Math.floor(Math.random() * 30) + 1; // 1-30 days
    }
    
    if (lowerFieldName.includes('package') || lowerFieldName.includes('parcel')) {
      return Math.floor(Math.random() * 20) + 1; // 1-20
    }
    
    // Default integer ranges
    return Math.floor(Math.random() * 1000) + 1;
  }

  generateDecimalValue(fieldName) {
    const lowerFieldName = fieldName.toLowerCase();
    
    if (lowerFieldName.includes('price') || lowerFieldName.includes('cost') || lowerFieldName.includes('amount')) {
      if (lowerFieldName.includes('total') || lowerFieldName.includes('sum')) {
        return Math.round((Math.random() * 5000 + 100) * 100) / 100; // 100.00-5100.00
      } else {
        return Math.round((Math.random() * 500 + 10) * 100) / 100; // 10.00-510.00
      }
    }
    
    if (lowerFieldName.includes('weight')) {
      if (lowerFieldName.includes('total') || lowerFieldName.includes('gross')) {
        return Math.round((Math.random() * 1000 + 50) * 100) / 100; // 50.00-1050.00 kg
      } else {
        return Math.round((Math.random() * 100 + 1) * 100) / 100; // 1.00-101.00 kg
      }
    }
    
    if (lowerFieldName.includes('volume')) {
      return Math.round((Math.random() * 50 + 0.1) * 1000) / 1000; // 0.100-50.100 m³
    }
    
    if (lowerFieldName.includes('length') || lowerFieldName.includes('width') || lowerFieldName.includes('height')) {
      return Math.round((Math.random() * 200 + 10) * 100) / 100; // 10.00-210.00 cm
    }
    
    if (lowerFieldName.includes('rate') || lowerFieldName.includes('percentage')) {
      return Math.round(Math.random() * 100 * 100) / 100; // 0.00-100.00%
    }
    
    if (lowerFieldName.includes('quantity') || lowerFieldName.includes('qty')) {
      return Math.round((Math.random() * 1000 + 1) * 100) / 100; // 1.00-1001.00
    }
    
    if (lowerFieldName.includes('time') && lowerFieldName.includes('processing')) {
      return Math.round((Math.random() * 24 + 0.5) * 100) / 100; // 0.50-24.50 hours
    }
    
    // Default decimal values
    return Math.round(Math.random() * 1000 * 100) / 100;
  }

  generateDateValue() {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  formatAsXML(data, rootElementName) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    // For the root element, we need to handle it specially
    if (typeof data === 'object' && data[rootElementName]) {
      xml += this.objectToXML(data[rootElementName], rootElementName);
    } else {
      xml += this.objectToXML(data, rootElementName);
    }
    
    return xml;
  }

  objectToXML(obj, elementName) {
    if (Array.isArray(obj)) {
      return obj.map(item => this.objectToXML(item, elementName)).join('\n');
    }
    
    if (typeof obj === 'object' && obj !== null) {
      let xml = `<${elementName}>`;
      for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
          xml += '\n' + value.map(item => this.objectToXML(item, key)).join('\n');
        } else {
          xml += '\n' + this.objectToXML(value, key);
        }
      }
      xml += `\n</${elementName}>`;
      return xml;
    }
    
    return `<${elementName}>${this.escapeXML(obj)}</${elementName}>`;
  }

  escapeXML(str) {
    if (typeof str !== 'string') {
      return String(str);
    }
    
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

export default PayloadGenerator;
