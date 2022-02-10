function muestraErrorEnInput(item, mensaje) {
    var padre = $(item).parent(".form-outline,.wrapper-select");
    var campo = padre.children(".form-control,.form-control-select");
    campo.addClass("borderHasError").addClass("input-invalid");
    var etiqueta = padre.children(".form-label");
    etiqueta.addClass("hasError");
    var message = padre.next(".help-text,.StyleGrisInputs");
    message.addClass("hasError");
    message.fadeIn(1200);
    message.children("small").text(mensaje);
}
function ocultarErrorEnInput(item) {
    var padre = $(item).parent(".form-outline,.wrapper-select");
    var campo = padre.children(".form-control,.form-control-select");
    campo.removeClass("borderHasError").removeClass("input-invalid");
    var etiqueta = padre.children(".form-label");
    etiqueta.removeClass("hasError");
    var message = padre.next(".help-text,.StyleGrisInputs");
    message.addClass("hasError");
    message.fadeOut(1200);
    message.children("small").text("");
}
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
function isCurpValid(curp) {
    var regex = /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;
    return regex.test(curp);
}
function isRfcValid(rfc) {
    var regex = /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([A-Z]|[0-9]){2}([A]|[0-9]){1})?$/;
    console.log(regex.test(rfc));
    return regex.test(rfc);
}
function MuestraRegimen() {
    $('#RegimenFiscalPersonaMoral,#RegimenFiscalPersonaFisica').find("input,select").each(function () {
        if ($(this).prop('nodeName') === 'INPUT') {
            $(this).val('');
        } else if ($(this).prop('nodeName') === 'SELECT') {
            $(this).html('<option></option>');
        }
    });
    $('#RegimenFiscalPersonaMoral,#RegimenFiscalPersonaFisica').hide();
    var RegimenFiscal = $('input[name="rad_Regimen"]:checked').val();
    if (RegimenFiscal === 'PersonaFisica') {
        $('#RegimenFiscalPersonaMoral,#RegimenFiscalPersonaFisica').hide();
        $('#RegimenFiscalPersonaMoral').fadeIn(1000);
    } else if (RegimenFiscal === 'PersonaMoral') {
        $('#RegimenFiscalPersonaMoral,#RegimenFiscalPersonaFisica').hide();
        $('#RegimenFiscalPersonaFisica').fadeIn(1000);
    }
}
function validarLogistica() {
    $("input.onlyNumbers").keypress(function (e) {
        var charCode = (e.which) ? e.which : event.keyCode;
        if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }).on('paste', function (e) {
        var $this = $(this);
        setTimeout(function () {
            $this.val($this.val().replace(/[^0-9]/g, ''));
        }, 5);
    });
    /* Logistica */
    $('input#txtCodigoPostal').change(function () {
        var txtCodigoPostal = $(this);
        var cp = $(this).val();
        if (cp.length == 5) {
            var url = 'http://3.15.178.152:443/sepomex/codigo_postal';
            var data = {
                codigo_postal: cp
            }
            $.get(url, data).done(function (response) {
                try {
                    if (response.code == 200) {
                        console.log("Codigo Postal encontrado.");
                        $("select#select-colonia").html('<option selected></option>');
                        $("select#select-estado").html('<option selected></option>');
                        response.colonias.forEach(colonia => {
                            var option = '<option value="' + colonia.id + '">' + colonia.descripcion + '</option>';
                            $("select#select-colonia").append(option);
                        });
                        var estado = '<option selected></option><option value="' + response.estado.id + '" >' + response.estado.descripcion + '</option>';
                        $("select#select-estado").html(estado);
                        var municipio = '<option selected></option><option value="' + response.municipio.id + '" >' + response.municipio.descripcion + '</option>';
                        $("select#select-municipio").html(municipio);
                    } else {
                        console.log(response);
                    }
                } catch (error) {
                    muestraErrorEnInput(txtCodigoPostal, "El Codigo Postal no fue encontrado.");
                    console.log(error);
                }
            }).fail(function (error) {
                console.log(error);
            }).always(function () {

            });
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "Escribe un código postal válido.");
        }
    });
    $('input#txtNombre,input#txtNombreGrantias').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo nombre es requerido.");
        }
    });
    $('input#txtApellido').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo apellido es requerido.");
        }
    });
    $('input#txtTelefonoPrincipal,input#txtTelefonoGarantias').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            if (item.val().length == 10) {
                ocultarErrorEnInput($(this));
            } else {
                muestraErrorEnInput($(this), "Escribe un número de teléfono válido.");
            }
        } else {
            muestraErrorEnInput($(this), "El campo teléfono es requerido.");
        }
    });
    $('input#txtCorreoElectronico,input#txtCorreoGarantias').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            if (isEmail(item.val())) {
                ocultarErrorEnInput($(this));
            } else {
                muestraErrorEnInput($(this), "Escribe un correo electrónico válido.");
            }
        } else {
            muestraErrorEnInput($(this), "El campo correo electronico es requerido.");
        }
    });
    $('select#select-estado,select#select-municipio,select#select-colonia').change(function () {
        var item = $(this);

        if (item.val() !== '') {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "Selecciona una opción.");
        }
    });
    $('input#txtCalle').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo calle es requerido.");
        }
    });
    $('input#txtNumeroExterior').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo número exterior es requerido.");
        }
    });
    /* Logistica */
}
function validarDocumentos() {
    $("input.inputFile").change(function () {
        var id = $(this).attr("id");
        var maximoEnBytes = 2048; //test 600 }}} prod 2048
        var filename = '';
        if ($(this)[0].files.length) {
            let fileSize = Math.round($(this)[0].files[0].size / 1024);
            filename = $(this)[0].files[0].name;
            if (fileSize > maximoEnBytes) {
                $("label.text-helper[for=" + id + "]").addClass('hasError');
                $("label.text-helper[for=" + id + "]").html('El archivo supera los 2 MB.');
            } else {
                $("label.text-helper[for=" + id + "]").removeClass('hasError');
                $("label.text-helper[for=" + id + "]").html(filename);
            }
        }
    });
}
function validarContacto() {
    $("input.onlyNumbers").keypress(function (e) {
        var charCode = (e.which) ? e.which : event.keyCode;
        if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }).on('paste', function (e) {
        var $this = $(this);
        setTimeout(function () {
            $this.val($this.val().replace(/[^0-9]/g, ''));
        }, 5);
    });
    $('input#nombres').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo nombre es requerido.");
        }
    });
    $('input#apellidos').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo apellido es requerido.");
        }
    });
    $('input#celular').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            if (item.val().length == 10) {
                ocultarErrorEnInput($(this));
            } else {
                muestraErrorEnInput($(this), "Escribe un número de teléfono válido.");
            }
        } else {
            muestraErrorEnInput($(this), "El campo teléfono es requerido.");
        }
    });
    $('input#correo').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            if (isEmail(item.val())) {
                ocultarErrorEnInput($(this));
            } else {
                muestraErrorEnInput($(this), "Escribe un correo electrónico válido.");
            }
        } else {
            muestraErrorEnInput($(this), "El campo correo electronico es requerido.");
        }
    });
    $('input#nombrecomercial').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo nombre comercial en Coppel es requerido.");
        }
    });
}
function validaDatosOficiales() {
    $("input.onlyNumbers").keypress(function (e) {
        var charCode = (e.which) ? e.which : event.keyCode;
        if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }).on('paste', function (e) {
        var $this = $(this);
        setTimeout(function () {
            $this.val($this.val().replace(/[^0-9]/g, ''));
        }, 5);
    });
    $('input#txtNombre').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo nombre completo es requerido.");
        }
    });
    $('input#txtCURP').change(function () {
        var item = $(this);
        item.val(item.val().toUpperCase());
        if (item.val().length > 0) {
            if (item.val().length > 15) {
                if (isCurpValid(item.val())) {
                    ocultarErrorEnInput($(this));
                } else {
                    muestraErrorEnInput($(this), "Este formato de CURP no es válido. Verifícalo por favor.");
                }
            } else {
                muestraErrorEnInput($(this), "Este formato de CURP no es válido. Verifícalo por favor.");
            }
        } else {
            muestraErrorEnInput($(this), "El campo CURP es requerido.");
        }
    });
    $('input#txtFechaNacimiento').datepicker({
        dateFormat: 'dd/mm/yy', onSelect: function (fecha, item) {
            $("#" + item.id).focus();
            $("#" + item.id).blur();
        }
    }).change(function () {
        var item = $(this);
        console.log(item);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo Fecha de Nacimiento es requerido.");
        }
    });
    $('input#txtTelefono,input#txtMoralTelefono,input#txtContribuyenteTelefono').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            if (item.val().length == 10) {
                ocultarErrorEnInput($(this));
            } else {
                muestraErrorEnInput($(this), "Escribe un número de teléfono válido.");
            }
        } else {
            muestraErrorEnInput($(this), "El campo teléfono es requerido.");
        }
    });
    $('input#txtCorreoElectronico').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            if (isEmail(item.val())) {
                ocultarErrorEnInput($(this));
            } else {
                muestraErrorEnInput($(this), "Escribe un correo electrónico válido.");
            }
        } else {
            muestraErrorEnInput($(this), "El campo correo electronico es requerido.");
        }
    });
    $('input#txtNombreCompleto').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo nombre completo es requerido.");
        }
    });
    $('input#txtBanco').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo nombre del banco es requerido.");
        }
    });
    $('input#txtCuenta').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo cuenta de banco es requerido.");
        }
    });
    $('input#txtClabe').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            if (item.val().length === 18) {
                ocultarErrorEnInput($(this));
            } else {
                muestraErrorEnInput($(this), "Escribe una CLABE interbancaria válida.");
            }
        } else {
            muestraErrorEnInput($(this), "El campo CLABE interbancaria es requerido.");
        }
    });
    $('input#txtMoralRazonSocial').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo Razón Social es requerido.");
        }
    });
    $('input#txtMoralRFC,input#txtRFCContribuyente').change(function () {
        var item = $(this);
        item.val(item.val().toUpperCase());
        if (item.val().length > 0) {
            if (item.val().length > 11) {
                if (isRfcValid(item.val())) {
                    ocultarErrorEnInput($(this));
                } else {
                    muestraErrorEnInput($(this), "Este formato de RFC no es válido. Verifícalo por favor.");
                }
            } else {
                muestraErrorEnInput($(this), "Este formato de RFC no es válido. Verifícalo por favor.");
            }
        } else {
            muestraErrorEnInput($(this), "El campo RFC es requerido.");
        }
    });
    $('input#txtMoralCP').change(function () {
        var txtCodigoPostal = $(this);
        var cp = $(this).val();
        if (cp.length == 5) {
            var url = 'http://3.15.178.152:443/sepomex/codigo_postal';
            var data = {
                codigo_postal: cp
            }
            $.get(url, data).done(function (response) {
                try {
                    if (response.code == 200) {
                        console.log("Codigo Postal encontrado.");
                        $("select#select-moral-colonia").html('<option selected></option>');
                        $("select#select-moral-estado").html('<option selected></option>');
                        response.colonias.forEach(colonia => {
                            var option = '<option value="' + colonia.id + '">' + colonia.descripcion + '</option>';
                            $("select#select-moral-colonia").append(option);
                        });
                        var estado = '<option selected></option><option value="' + response.estado.id + '" >' + response.estado.descripcion + '</option>';
                        $("select#select-moral-estado").html(estado);
                        var municipio = '<option selected></option><option value="' + response.municipio.id + '" >' + response.municipio.descripcion + '</option>';
                        $("select#select-moral-municipio").html(municipio);
                    } else {
                        console.log(response);
                    }
                } catch (error) {
                    muestraErrorEnInput(txtCodigoPostal, "El Codigo Postal no fue encontrado.");
                    console.log(error);
                }
            }).fail(function (error) {
                console.log(error);
            }).always(function () {

            });
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "Escribe un código postal válido.");
        }
    });
    $('select#select-moral-estado,select#select-moral-municipio,select#select-moral-colonia,select#select-estado,select#select-municipio,select#select-colonia').change(function () {
        var item = $(this);

        if (item.val() !== '') {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "Selecciona una opción.");
        }
    });
    $('input#txtMoralCalle,input#txtContribuyenteCalle').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo Calle es requerido.");
        }
    });
    $('input#txtNombreContribuyente').change(function () {
        var item = $(this);
        if (item.val().length > 0) {
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "El campo nombre completo es requerido.");
        }
    });
    $('input#txtCP').change(function () {
        var txtCodigoPostal = $(this);
        var cp = $(this).val();
        if (cp.length == 5) {
            var url = 'http://3.15.178.152:443/sepomex/codigo_postal';
            var data = {
                codigo_postal: cp
            }
            $.get(url, data).done(function (response) {
                try {
                    if (response.code == 200) {
                        console.log("Codigo Postal encontrado.");
                        $("select#select-colonia").html('<option selected></option>');
                        $("select#select-estado").html('<option selected></option>');
                        response.colonias.forEach(colonia => {
                            var option = '<option value="' + colonia.id + '">' + colonia.descripcion + '</option>';
                            $("select#select-colonia").append(option);
                        });
                        var estado = '<option selected></option><option value="' + response.estado.id + '" >' + response.estado.descripcion + '</option>';
                        $("select#select-estado").html(estado);
                        var municipio = '<option selected></option><option value="' + response.municipio.id + '" >' + response.municipio.descripcion + '</option>';
                        $("select#select-municipio").html(municipio);
                    } else {
                        console.log(response);
                    }
                } catch (error) {
                    muestraErrorEnInput(txtCodigoPostal, "El Codigo Postal no fue encontrado.");
                    console.log(error);
                }
            }).fail(function (error) {
                console.log(error);
            }).always(function () {

            });
            ocultarErrorEnInput($(this));
        } else {
            muestraErrorEnInput($(this), "Escribe un código postal válido.");
        }
    });
}
function validarConjunto(elements) {
    var counter = 0;
    $.each(elements, function (index, element) {
        var item = $(element.id);
        if (item.val().length > 0) {
            ocultarErrorEnInput(item);
        } else {
            muestraErrorEnInput(item, element.label);
            counter++;
        }
    });
    return counter;
}
function validarSubmitDatosOficiales() {
    var requeridos = [
        { id: 'input#txtNombre', label: 'El campo nombre completo es requerido.' },
        { id: 'input#txtCURP', label: 'El campo CURP es requerido.' },
        { id: 'input#txtFechaNacimiento', label: 'El campo feha de nacimiento es requerido.' },
        { id: 'input#txtTelefono', label: 'El campo teléfono es requerido.' },
        { id: 'input#txtCorreoElectronico', label: 'El campo correo electrónico es requerido.' },
        { id: 'input#txtNombreCompleto', label: 'El campo nombre completo del titular es requerido.' },
        { id: 'input#txtBanco', label: 'El campo nombre del banco es requerido.' },
        { id: 'input#txtCuenta', label: 'El campo número de cuenta es requerido.' },
        { id: 'input#txtClabe', label: 'El campo CLABE interbancaria es requerido.' }
    ];
    var requeridosFisica = [
        { id: 'input#txtNombreContribuyente', label: 'El campo nombre del contribuyente es requerido.' },
        { id: 'input#txtRFCContribuyente', label: 'El campo RFC es requerido.' },
        { id: 'input#txtCP', label: 'El campo código postal es requerido.' },
        { id: 'select#select-estado', label: 'Selecciona una opción.' },
        { id: 'select#select-municipio', label: 'Selecciona una opción.' },
        { id: 'select#select-colonia', label: 'Selecciona una opción.' },
        { id: 'input#txtContribuyenteCalle', label: 'El campo calle es requerido.' },
        { id: 'input#txtContribuyenteTelefono', label: 'El campo teléfono es requerido.' }
    ];
    var requeridosMoral = [
        { id: 'input#txtMoralRazonSocial', label: 'El campo razón social es requerido.' },
        { id: 'input#txtMoralRFC', label: 'El campo RFC es requerido.' },
        { id: 'input#txtMoralCP', label: 'El campo código postal es requerido.' },
        { id: 'select#select-moral-estado', label: 'Selecciona una opción.' },
        { id: 'select#select-moral-municipio', label: 'Selecciona una opción.' },
        { id: 'select#select-moral-colonia', label: 'Selecciona una opción.' },
        { id: 'input#txtMoralCalle', label: 'El campo calle es requerido.' },
        { id: 'input#txtMoralTelefono', label: 'El campo teléfono es requerido.' }
    ];
    var elements = [];
    var RegimenFiscal = $('input[name="rad_Regimen"]:checked').val();
    if (RegimenFiscal === 'PersonaFisica') {
        elements = $.merge(requeridos, requeridosFisica);
    } else if (RegimenFiscal === 'PersonaMoral') {
        elements = $.merge(requeridos, requeridosMoral);
    }
    return !(validarConjunto(elements) > 0);
}
function validarSubmitLogistica() {
    var requeridos = [
        { id: 'input#txtNombre', label: 'El campo nombre es requerido.' },
        { id: 'input#txtApellido', label: 'El campo apellido es requerido.' },
        { id: 'input#txtTelefonoPrincipal', label: 'El campo teléfono es requerido.' },
        { id: 'input#txtCorreoElectronico', label: 'El campo correo electrónico es requerido.' },
        { id: 'input#txtCodigoPostal', label: 'El campo código postal es requerido.' },
        { id: 'select#select-estado', label: 'Selecciona una opción.' },
        { id: 'select#select-municipio', label: 'Selecciona una opción.' },
        { id: 'select#select-colonia', label: 'Selecciona una opción.' },
        { id: 'input#txtCalle', label: 'El campo calle es requerido.' },
        { id: 'input#txtNumeroExterior', label: 'El campo número exterior es requerido.' },
        { id: 'input#txtNombreGrantias', label: 'El campo nombre es requerido.' },
        { id: 'input#txtCorreoGarantias', label: 'El campo correo electrónico es requerido.'},
        { id: 'input#txtTelefonoGarantias', label: 'El campo teléfono es requerido.'}

    ];
    return !(validarConjunto(requeridos) > 0);
}
function validarSubmitDocumentos() {
    $("input.inputFile").each(function () {
        var counter = 0;
        var id = $(this).attr("id");
        var maximoEnBytes = 2048; //test 600 }}} prod 2048
        var filename = '';
        if ($(this)[0].files.length) {
            let fileSize = Math.round($(this)[0].files[0].size / 1024);
            filename = $(this)[0].files[0].name;
            if (fileSize > maximoEnBytes) {
                counter++;
                $("label.text-helper[for=" + id + "]").addClass('hasError');
                $("label.text-helper[for=" + id + "]").html('El archivo supera los 2 MB.');
            } else {
                $("label.text-helper[for=" + id + "]").removeClass('hasError');
                $("label.text-helper[for=" + id + "]").html(filename);
            }
        } else {
            counter++;
            $("label.text-helper[for=" + id + "]").addClass('hasError');
            $("label.text-helper[for=" + id + "]").html('Archivo Requerido.');
        }
    });
    return !(counter > 0);
}