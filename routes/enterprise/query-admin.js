const { queryDatabase } = require('../../services/db/query');
const moment = require('moment-timezone');

async function insertEnterprise(body) {
    const id_dep_aux = body.id_dep.id;
    const id_tipo_aux = body.id_tipo.id;
    const id_rubro_aux = body.id_rubro.id;
    const formattedDateReg = moment().tz('America/La_Paz').format('YYYY-MM-DDTHH:mm:ss');
    const query = `INSERT INTO empresas (nombre, numero, nit, correo, id_tipo, razon, id_rubro, legal, legal_ci, matricula, id_dep, descr, direccion, enlaces, logo, fec_c) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [body.nombre, body.numero, body.nit, body.correo, id_tipo_aux, body.razon, id_rubro_aux, body.legal, body.legal_ci, body.matricula, id_dep_aux, body.desc, body.direccion, body.links, body.logo64, formattedDateReg];

    try {
        await queryDatabase(query, values);
        return { mensaje: "Registrado exitosamente" };
    } catch (error) {
        throw error;
    }
}

async function getEnterprisesLazyLoading(startIndex, numRows, globalFilter, sortField, sortOrder, startDate, endDate, status, department, ) {
    let query = `SELECT e.*, r.nombre as "rubro", COALESCE(ev.estado, '0') as "evaluado"
    FROM empresas e
    LEFT JOIN rubros r ON e.id_rubro = r.id
    LEFT JOIN departamento d ON e.id_dep = d.id
    LEFT JOIN evaluado ev ON e.id = ev.id_emp
    WHERE e.activo = 1
    `;

    if (globalFilter) {
        query += ` AND (e.nombre LIKE '%${globalFilter}%' OR e.legal LIKE '%${globalFilter}%' OR e.direccion LIKE '%${globalFilter}%' ) `;
    }

    if (startDate && endDate) {
        const formatedStartDate = new Date(startDate).toISOString().slice(0, 19).replace("T", " ");
        const formatedEndDate = new Date(endDate).toISOString().slice(0, 19).replace("T", " ");
        query += ` AND e.fec_c BETWEEN '${formatedStartDate}' AND '${formatedEndDate}'`;
    }

    if (sortField && sortOrder) {
        query += ` ORDER BY ${sortField} ${sortOrder === '1' ? 'ASC' : 'DESC'}`;
    } else {
        query += ` ORDER BY e.id DESC`;
    }

    query += ` LIMIT ${startIndex}, ${numRows}`;

    return query;
}

async function getTotalRows(globalFilter, startDate, endDate) {
    let totalFilasQuery = `SELECT COUNT(*) AS totalFilas FROM empresas e JOIN departamento d ON e.id_dep = d.id WHERE e.activo = 1`;

    if (startDate && endDate) {
        const formatedStartDate = new Date(startDate).toISOString().slice(0, 19).replace("T", " ");
        const formatedEndDate = new Date(endDate).toISOString().slice(0, 19).replace("T", " ");
        totalFilasQuery += ` AND e.fec_c BETWEEN '${formatedStartDate}' AND '${formatedEndDate}'`;
    }

    if (globalFilter) {
        totalFilasQuery += ` AND (e.nombre LIKE '%${globalFilter}%' OR e.legal LIKE '%${globalFilter}%' OR e.direccion LIKE '%${globalFilter}%' ) `;
    }


    return totalFilasQuery;
}

async function getWaitListLazyLoading(startIndex, numRows, globalFilter, sortField, sortOrder ) {
    let query = `SELECT e.*, r.nombre as "rubro", COALESCE(ev.estado, '0') as "evaluado"
    FROM empresas e
    LEFT JOIN rubros r ON e.id_rubro = r.id
    LEFT JOIN departamento d ON e.id_dep = d.id
    LEFT JOIN evaluado ev ON e.id = ev.id_emp
    WHERE e.activo = 1
    `;

    if (globalFilter) {
        query += ` AND (e.nombre LIKE '%${globalFilter}%' OR e.legal LIKE '%${globalFilter}%' OR e.direccion LIKE '%${globalFilter}%' ) `;
    }

    if (startDate && endDate) {
        const formatedStartDate = new Date(startDate).toISOString().slice(0, 19).replace("T", " ");
        const formatedEndDate = new Date(endDate).toISOString().slice(0, 19).replace("T", " ");
        query += ` AND e.fec_c BETWEEN '${formatedStartDate}' AND '${formatedEndDate}'`;
    }

    if (sortField && sortOrder) {
        query += ` ORDER BY ${sortField} ${sortOrder === '1' ? 'ASC' : 'DESC'}`;
    } else {
        query += ` ORDER BY e.id DESC`;
    }

    query += ` LIMIT ${startIndex}, ${numRows}`;

    return query;
}

async function getWaitListTotalRows(globalFilter, startDate, endDate) {
    let totalFilasQuery = `SELECT COUNT(*) AS totalFilas FROM empresas e JOIN departamento d ON e.id_dep = d.id WHERE e.activo = 1`;

    if (startDate && endDate) {
        const formatedStartDate = new Date(startDate).toISOString().slice(0, 19).replace("T", " ");
        const formatedEndDate = new Date(endDate).toISOString().slice(0, 19).replace("T", " ");
        totalFilasQuery += ` AND e.fec_c BETWEEN '${formatedStartDate}' AND '${formatedEndDate}'`;
    }

    if (globalFilter) {
        totalFilasQuery += ` AND (e.nombre LIKE '%${globalFilter}%' OR e.legal LIKE '%${globalFilter}%' OR e.direccion LIKE '%${globalFilter}%' ) `;
    }


    return totalFilasQuery;
}


async function getEnterpriseById(id) {
    const query = `SELECT * FROM empresas WHERE id = ?`;

    try {
        const result = await queryDatabase(query, [id]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getDept() {
    const query = `SELECT d.id, d.nombre FROM departamento d WHERE d.activo = 1`;

    try {
        const result = await queryDatabase(query,);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getRubr() {
    const query = `SELECT r.id, r.nombre FROM rubros r WHERE r.activo = 1`;

    try {
        const result = await queryDatabase(query,);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getType() {
    const query = `SELECT t.id, t.nombre FROM tipo_e t WHERE t.activo = 1`;

    try {
        const result = await queryDatabase(query,);
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateEnterprise(id, updateData) {
    if (Object.keys(updateData).length === 0) {
        return;
    }

    let query = `UPDATE empresas SET `;
    const values = [];

    if (updateData.nombre !== null) {
        query += `nombre = ?, `;
        values.push(updateData.nombre);
    }

    if (updateData.numero !== null) {
        query += `numero = ?, `;
        values.push(updateData.numero);
    }

    if (updateData.nit !== null) {
        query += `nit = ?, `;
        values.push(updateData.nit);
    }

    if (updateData.correo !== null) {
        query += `correo = ?, `;
        values.push(updateData.correo);
    }

    if (updateData.id_tipo !== null) {
        const id_tipo_aux = updateData.id_tipo.id;
        query += `id_tipo = ?, `;
        values.push(id_tipo_aux);
    }

    if (updateData.razon !== null) {
        query += `razon = ?, `;
        values.push(updateData.razon);
    }

    if (updateData.id_rubro !== null) {
        const id_rubro_aux = updateData.id_rubro.id;
        query += `id_rubro = ?, `;
        values.push(id_rubro_aux);
    }

    if (updateData.legal !== null) {
        query += `legal = ?, `;
        values.push(updateData.legal);
    }

    if (updateData.legal_ci !== null) {
        query += `legal_ci = ?, `;
        values.push(updateData.legal_ci);
    }

    if (updateData.matricula !== null) {
        query += `matricula = ?, `;
        values.push(updateData.matricula);
    }

    if (updateData.id_dep !== null) {
        const id_dep_aux = updateData.id_dep.id;
        query += `id_dep = ?, `;
        values.push(id_dep_aux);
    }

    if (updateData.desc !== null) {
        query += `descr = ?, `;
        values.push(updateData.desc);
    }

    if (updateData.direccion !== null) {
        query += `direccion = ?, `;
        values.push(updateData.direccion);
    }

    if (updateData.links !== null) {
        query += `enlaces = ?, `;
        values.push(updateData.links);
    }

    if (updateData.logo64 !== null) {
        query += `logo = ?, `;
        values.push(updateData.logo64);
    }

    const formattedDateReg = moment().tz('America/La_Paz').format('YYYY-MM-DDTHH:mm:ss');
    if (formattedDateReg) {
        query += `fec_a = ?, `;
        values.push(formattedDateReg);
    }

    query = query.slice(0, -2);

    query += ` WHERE id = ?`;
    values.push(id);

    try {
        const result = await queryDatabase(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}

async function aprobeEnterprise(id,) {

    let query = `INSERT evaluado (id_emp, estado) VALUES (?, ?) `;
    const values = [id, 1];
    try {
        const result = await queryDatabase(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}

async function deleteEnterprise(id) {
    const query = `UPDATE empresas SET activo = 0 WHERE id = ?`;
    const values = [id];
    try {
        const result = await queryDatabase(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = { insertEnterprise, getDept, getRubr, getType, getEnterprisesLazyLoading, getEnterpriseById, getTotalRows, aprobeEnterprise, updateEnterprise, deleteEnterprise };
