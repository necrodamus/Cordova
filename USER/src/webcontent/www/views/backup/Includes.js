
if (!String.prototype.includes)
{
    String.prototype.includes = function(str)
    {
        return (this.toUpperCase().indexOf(str.toUpperCase()) > -1 ? true : false);
    }
}

if (!String.prototype.replaceAt) {
    String.prototype.replaceAt = function (iIndex, cCaracter) {
        return this.substr(0, iIndex) + cCaracter + this.substr(iIndex + cCaracter.length);
    }
}
