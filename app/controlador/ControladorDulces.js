//const ModeloDulces = require('../modelo/ModeloDulces');
const modeloDulce = require('../modelo/ModeloDulces')

function index(req,res) {
    console.log('ok');
    modeloDulce.find({})
    .then(dulces => {
        if(dulces.length) return res.status(200).send({dulces});
        return res.status(204).send({message:'No hay contenido'});
    }).catch(error => res.status(500).send({error}));
}

function agregar(req,res) {
    console.log(req.body);
    new modeloDulce(req.body).save()
    .then(dulces => {
        res.status(200).send({dulces})
    }).catch(error => res.status(500).send({error}));
}

function buscar(req, res, next){
    let consulta = {};
    consulta[req.params.key]=req.params.value;
    modeloDulce.find(consulta).then(dulces =>{
        if(!dulces.length) return next();
        req.body.dulces=dulces;
        return next();
    }).catch(error => {
        req.body.error=error;
        next();
    })
}

function mostrar(req,res){
    if(req.body.error) return res.status(500).send({error});
    if(!req.body.dulces) return res.status(404).send({message: 'No se encontraron datos'});
    let dulcesObj= req.body.dulces;
    return res.status(200).send({dulcesObj});
}

function actualizar (req, res){
    if (req.body.error) return res.status(500).send({error});
    if (!req.body.dulces) return res.status(404).send({message: 'no se encontraron datos para actualizar'});
    let dulcesObj = req.body.dulces[0];
    dulcesObj = Object.assign(dulcesObj, req.body);
    dulcesObj.save().then(dulcesAlta =>{
        res.status(200).send({message: 'Los datos se actualizaron correctamente.', dulcesAlta});
    }).catch(error => res.status(500).send ({error}));
}

function eliminar (req, res){
    if(req.body.error) return res.status(500).send({error});
    if (!req.body.dulces) return res.status(404).send({message: 'no se encontraron datos para eliminar'});
    let dulcesObj = req.body.dulces[0].remove().then (dulcesEliminar =>{
        res.status(200).send({message: 'Los datos se eliminaron.', dulcesEliminar});
    }).catch(error => res.status(500).send ({error}));
}


module.exports={
    index,
    agregar,
    buscar,
    mostrar,
    actualizar,
    eliminar
}