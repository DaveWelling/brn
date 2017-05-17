Blockly.JavaScript['relation'] = function(blocklyBlock) {
  const textTitle = blocklyBlock.getFieldValue('title');
  const textPrettyName = blocklyBlock.getFieldValue('prettyName');

  let code = `{
    "title": "${textTitle}",
    "prettyName": "${textPrettyName}",
    "withCustomApiController": false,
    "withCustomRepository": false
  }`;
  return code;
};

Blockly.JavaScript['namespace'] = function(blocklyBlock) {
  const textTitle = blocklyBlock.getFieldValue('title');
  const textDescription = blocklyBlock.getFieldValue('description');
  const statementsRelations = Blockly.JavaScript.statementToCode(blocklyBlock, 'Relations');
  const childrenSecurityModifiers = Blockly.JavaScript.valueToCode(blocklyBlock, 'securityModifier');
  let code = `{
    "title": "${textTitle}",
    "description": "${textDescription}",
    "relations": [${statementsRelations}]
  `;
  if (childrenSecurityModifiers){
    code = code + ', ' + childrenSecurityModifiers;
  }
  return code + '}';
};

Blockly.JavaScript['usecase'] = function(blocklyBlock) {
  const textTitle = blocklyBlock.getFieldValue('title');
  const statementsNamespaces = Blockly.JavaScript.statementToCode(blocklyBlock, 'namespaces');
  const valueAppLayout = Blockly.JavaScript.valueToCode(blocklyBlock, 'appLayout', Blockly.JavaScript.ORDER_ATOMIC) || '{}';
  const useCaseId = blocklyBlock.data = blocklyBlock.data || new ObjectId().toString();

  // Get release version.
  const major = blocklyBlock.getFieldValue('majorVer');
  const minor = blocklyBlock.getFieldValue('minorVer');
  const patch = blocklyBlock.getFieldValue('patchVer');
  const release = `${parseInt(major)}.${parseInt(minor)}.${parseInt(patch)}`;

  let code = `{
    "title": "${textTitle}",
    "featureFlags": [],
    "_id": "${useCaseId}",
    "release": "${release}",
    "namespaces": [${statementsNamespaces}],
    "hNodes": ${valueAppLayout}
  }`;
  return code;
};

Blockly.JavaScript['addforfeatureflags'] = function(blocklyBlock) {
  const textFeatureFlag = blocklyBlock.getFieldValue('featureFlag');
  const childrenSecurityModifiers = Blockly.JavaScript.valueToCode(blocklyBlock, 'securityModifier');
  let code = `"addForFeatureFlags": "${textFeatureFlag}"`;
  if (childrenSecurityModifiers){
    code = code + ', ' + childrenSecurityModifiers;
  }
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript['removeforfeatureflag'] = function(blocklyBlock) {
  const textFeatureFlag = blocklyBlock.getFieldValue('featureFlag');
  const childrenSecurityModifiers = Blockly.JavaScript.valueToCode(blocklyBlock, 'securityModifier');
  let code = `"removeForFeatureFlag": "${textFeatureFlag}"`;
  if (childrenSecurityModifiers){
    code = code + ', ' + childrenSecurityModifiers;
  }
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['hiddenfor'] = function(blocklyBlock) {
  const textHiddenFor = blocklyBlock.getFieldValue('hiddenfor');
  const childrenSecurityModifiers = Blockly.JavaScript.valueToCode(blocklyBlock, 'securityModifier');
  let code = `"hiddenFor": "${textHiddenFor}"`;
  if (childrenSecurityModifiers){
    code = code + ', ' + childrenSecurityModifiers;
  }
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript['readonlyfor'] = function(blocklyBlock) {
  const textReadOnlyFor = blocklyBlock.getFieldValue('readonlyfor');
  const childrenSecurityModifiers = Blockly.JavaScript.valueToCode(blocklyBlock, 'securityModifier');
  let code = `"readOnlyFor": "${textReadOnlyFor}"`;
  if (childrenSecurityModifiers){
    code = code + ', ' + childrenSecurityModifiers;
  }
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};