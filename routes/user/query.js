const {queryDatabase} = require('../../services/db/query');
const bcrypt = require('bcrypt');

async function createUser({ name, password, email, rol, parish }) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `INSERT INTO User (UserName, Password, Gmail, Role, Erased, ParishId) VALUES (?, ?, ?, ?, 0, ?)`;
    const values = [name, hashedPassword, email, rol, parish];

    try {
        const result = await queryDatabase(query, values);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getUsersLazyLoading(startIndex, numRows, globalFilter, sortField, sortOrder) {
    let query = `SELECT u.*, p.Name as Parish FROM User u JOIN Parish p ON u.ParishId = p.Id WHERE u.Erased = 0`;

    if (globalFilter) {
        query += ` AND u.UserName LIKE '%${globalFilter}%'`;
    }

    if (sortField && sortOrder) {
        query += ` ORDER BY ${sortField} ${sortOrder === '1' ? 'ASC' : 'DESC'}`;
    }

    query += ` LIMIT ${startIndex}, ${numRows}`;

    return query;


}

async function getTotalUsers(globalFilter) {
    let totalFilasQuery = `SELECT COUNT(*) AS totalFilas FROM User WHERE Erased = 0`;
    if (globalFilter) {
        totalFilasQuery += ` AND UserName LIKE '%${globalFilter}%'`;
    }

    return totalFilasQuery;
}

async function getUserById(id) {
    const query = `SELECT * FROM User WHERE Id = ?`;

    try {
        const result = await queryDatabase(query, [id]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateUser(id, updateData) {
    if (Object.keys(updateData).length === 0) {
        return;
    }

    let query = `UPDATE User SET `;
    const values = [];

    if (updateData.name) {
        query += `UserName = ?, `;
        values.push(updateData.name);
    }

    if (typeof updateData.password === 'string' && updateData.password.trim() !== '') {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
        query += `Password = ?, `;
        values.push(hashedPassword);
    }

    if (updateData.email) {
        query += `Gmail = ?, `;
        values.push(updateData.email);
    }

    if (updateData.rol) {
        query += `Role = ?, `;
        values.push(updateData.rol);
    }

    if (updateData.parish) {
        query += `ParishId = ?, `;
        values.push(updateData.parish);
    }

    query = query.slice(0, -2);

    query += ` WHERE Id = ?`;
    values.push(id);

    try {
        const result = await queryDatabase(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}

async function deleteUser(id) {
    const query = `UPDATE User SET Erased = 1 WHERE Id = ?`;

    try {
        const result = await queryDatabase(query, [id]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = { createUser, getUsersLazyLoading, getTotalUsers, getUserById, updateUser, deleteUser };
