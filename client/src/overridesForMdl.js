

// We should check isDirty and isInvalid -- don't let mdl.
MaterialTextfield.prototype.updateClasses_ =  function() {
    this.checkDisabled();
    this.checkFocus();
};
