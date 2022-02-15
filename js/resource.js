var regimen;

function form_Create_Seller() {

    var _contacto = {
        Nombre: getCookie("contacto.Nombre"),
        Apellidos: getCookie("contacto.Apellidos"),
        Email: getCookie("contacto.Email"),
        Telefono: getCookie("contacto.Telefono")
    };

    var _operacion = {
        Regimen_Fiscal: getCookie("operacion.RegimenFiscal"),
        Url_Tienda: getCookie("operacion.UrlTienda"),
        Proveedor_Coppel: (getCookie("operacion.ProveedorCoppel") === 'true') ? true : (getCookie("operacion.ProveedorCoppel") === 'false') ? false : undefined,
        Categoria_Principal: getCookie("operacion.CategoriaPrincipal")
    };

    var _datosoficiales = {
        Nombre_Completo: getCookie("datosoficiales.NombreCompleto"),
        Fecha_Nacimiento: getCookie("datosoficiales.FechaNacimiento").replaceAll("/", "-"),
        Telefono_Celular: getCookie("datosoficiales.TelefonoCelular"),
        Correo_Electronico: getCookie("datosoficiales.CorreoElectronico"),
        Nombre_Tienda: getCookie("datosoficiales.NombreTienda"),
        Razon_Social: getCookie("datosoficiales.RazonSocial"),
        RFC_Empresa: getCookie("datosoficiales.RFCEmpresa"),
        Direccion_Fiscal: getCookie("datosoficiales.DireccionFiscal"),
        Codigo_Postal: getCookie("datosoficiales.CodigoPostal"),
        Colonia: getCookie("datosoficiales.Colonia"),
        Estado: getCookie("datosoficiales.Estado"),
        Ciudad: getCookie("datosoficiales.Ciudad"),
        Telefono_Fijo: getCookie("datosoficiales.TelefonoFijo"),
        Nombre_Titular: getCookie("datosoficiales.NombreTitular"),
        Numero_Cuenta: parseInt(getCookie("datosoficiales.NumeroCuenta")),
        Clave_Interbancaria: parseInt(getCookie("datosoficiales.ClaveInterbancaria")),
        Nombre_Banco: getCookie("datosoficiales.NombreBanco")
    };

    var num_Interior = 0;
    if (getCookie("logistica.NumeroInterior") != "") {

        num_Interior = parseInt(getCookie("logistica.NumeroInterior"));
    }

    var _logistica = {
        Nombre: getCookie("logistica.Nombre"),
        Apellidos: getCookie("logistica.Apellidos"),
        Telefono: getCookie("logistica.Telefono"),
        Telefono2: getCookie("logistica.Telefono2"),
        Email: getCookie("logistica.Email"),
        Calle: getCookie("logistica.Calle"),
        Numero_Exterior: parseInt(getCookie("logistica.NumeroExterior")),
        Numero_Interior: num_Interior, //TODO: change to VARCHAR
        Codigo_Postal: getCookie("logistica.CodigoPostal"),
        Colonia: getCookie("logistica.Colonia"),
        Estado: getCookie("logistica.Estado"),
        Ciudad: getCookie("logistica.Ciudad")
    };

    var _prospecto = {
        Categoria_Principal: getCookie("operacion.CategoriaPrincipal"),
        Clasificacion_Principal: "Negociación", //where?
        Nombre_Empresa: getCookie("datosoficiales.RazonSocial"),
        Proveedor_Coppel: (getCookie("operacion.ProveedorCoppel") === 'true') ? true : (getCookie("operacion.ProveedorCoppel") === 'false') ? false : undefined,
        Referido_Por: getCookie("prospecto.ReferidoPor"),
        GMV: "GMV" //where? 
    };

    var _formulario = JSON.stringify({
        formulario: [
            {
                "contacto": _contacto,
                "operacion": _operacion,
                "datosoficiales": _datosoficiales,
                "logistica": _logistica,
                "prospecto": _prospecto
            }
        ]
    });

    console.log(_formulario);
    // GET access_token
    $.ajax({
        url: "https://test.salesforce.com/services/oauth2/token",
        method: "POST",
        timeout: 30000,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            "grant_type": "password",
            "client_id": "3MVG9dzDZFnwTBRKXA8rVu5P00caW7GPdmAjcEdj8z5blPwsa4bbp4KsJ6a3qpTffeS4m.J2KSnxghcbNwcfq",
            "client_secret": "2756E454EA106B0E5C799DC8505A49DE6DE9371790ECD27971292FA4C5234ACE",
            "username": "integracion.mktp@coppel.com",
            "password": "MktP$7!1"
        },
        success: function (response) {

            console.log(response.token_type + " " + response.access_token);

            var form_Seller = {
                "url": "https://coppelmx--dev0.my.salesforce.com/services/apexrest/FormularioSeller/",
                "method": "POST",
                "timeout": 30000,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    "Authorization": response.token_type + " " + response.access_token
                },
                "data": _formulario,
            };

            $.ajax(form_Seller).done(function (response_form) {

                var resp = JSON.parse(response_form);
                console.log(resp);
                alert(resp.rfc);

            }).fail(function () {

                console.log("Error: send form");
                return false;
            });

            return true;
        },
        error: function (xhr, status, error) {

            console.log("Error: try get token");
            return false;
        }
    });

}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}