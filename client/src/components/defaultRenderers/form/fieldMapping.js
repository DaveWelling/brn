import config from '../../../config';
export default getFormFields;

function getFormFields(hNode, hNodeType) {

	let fields = [];
	if (hNodeType.fields) {
		fields = hNodeType.fields;
	} else {
		for (let propertyName in hNode) {
			if (hNode.hasOwnProperty(propertyName)) {
				switch (propertyName) {
					case '_links':
						// do nothing;
						break;
					case '_embedded':
						fields = fields.concat(getFieldsForEmbedded(hNode[propertyName], hNode));
						break;
					default:
					{
						if (!isMetaData(propertyName)) {
							fields.push(getFieldForProperty(hNode, propertyName, '', hNode));
						}
					}
				}
			}
		}
	}
	fields.forEach(applyTypeSpecificConfig);
	return fields;
}

function getFieldsForEmbedded(embedded, hNode) {
	let fields = [];
	// embedded properties are relationships
	// containing properties for those relationships
	for (let relName in embedded) {
		if (embedded.hasOwnProperty(relName)) {
			for (let propertyName in embedded[relName]) {
				if (embedded[relName].hasOwnProperty(propertyName) &&
					propertyName !== '_links' && !isMetaData(propertyName)
				) {
					let propertyPath = "_embedded['" + relName + "']['" + propertyName + "']";
					fields.push(getFieldForProperty(embedded[relName], propertyName, propertyPath, hNode));
				}
			}
		}
	}
	return fields;
}

function applyTypeSpecificConfig(field) {
	switch (field.type){
		case 'shortText': {
			if (field.key === 'title') {
				field.required = true;
			}
			break;
		}
	}
}


/** Do not show meta data in the form */
function isMetaData(propertyName) {
	return config.defaultMetaFields.indexOf(propertyName) >= 0;
}


function guessTypeUsingPropertyName(property, propertyName, propertyPath, model) {
	let field = {
		'key': propertyPath,
		'templateOptions': {'label': toLabel(propertyName)}
	};
	if (/email/gi.test(propertyName)) {
		field.type = 'email';
		return field;
	}

	if (/password/gi.test(propertyName)) {
		field.type = 'password';
		return field;
	}

	if (/date/gi.test(propertyName) || /time/gi.test(propertyName)) {
		field.type = 'date';
		model[propertyName] = new Date(property);
		return field;
	}

	if (/colou?r/gi.test(propertyName) || /time/gi.test(propertyName)) {
		field.type = 'color';
		return field;
	}

	return null;
}

function guessTypeUsingPropertyValue(property, propertyName, propertyPath, model) {
	let field = {
		'key': propertyPath,
		'templateOptions': {'label': toLabel(propertyName)}
	};
	switch (typeof property) {
		case 'string':
			if (property.length <= 200) {
				field.type = 'shortText';
			} else {
				field.type = 'longText';
			}
			break;
		case 'boolean':
			field.type = 'checkbox';
			break;
		case 'number':
			// This is probably a date if it is this big
			if (property > 18000000) { // 1/1/1970
				model[propertyName] = new Date(property);
				field.type = 'date';
			} else {
				field.type = 'number';
			}
			break;
		case 'object':
			if (property instanceof Date) {
				field.type = 'date';
				model[propertyName] = new Date(property);
				break;
			} else {
				// If foreign relationship (ie. "namespace:relationship" or "assetTracking.department")
				if (propertyName.indexOf(':') >= 0) {
					field.type = 'dropDownWithFilter';
					break;
				}
			}
		// break; let fall through to default
		default:
			return null;
	}
	return field;
}

function getFieldForProperty(model, propertyName, propertyPath, hNode) {
	if (propertyPath === '') {
		propertyPath = propertyName;
	}
	let property = model[propertyName];

	let propertyType = guessTypeUsingPropertyName(property, propertyName, propertyPath, model);

	if (propertyType) return propertyType;

	propertyType = guessTypeUsingPropertyValue(property, propertyName, propertyPath, model, hNode);

	if (propertyType) return propertyType;

	throw new Error('Primitive type ' + typeof property + ' was unhandled with value of ' + property);
}

function toLabel(propertyName) {
	// If using curie, remove curie prefix
	let colonIndex = propertyName.indexOf(':');
	if (colonIndex >= 0) {
		propertyName = propertyName.substr(colonIndex + 1);
	}
	// insert a space between lower & upper
	return propertyName.replace(/([a-z,0-9])([A-Z,0-9])/g, '$1 $2')
	// space before last upper in a sequence followed by lower
		.replace(/\b([A-Z,0-9]+)([A-Z])([a-z])/, '$1 $2$3')
		// uppercase the first character
		.replace(/^./, function (str) {
			return str.toUpperCase();
		});
}


