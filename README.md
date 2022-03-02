# videoGameStore

DROP TABLE detalleMovimiento;
DROP TABLE movimiento;
DROP TABLE tipoMovimiento;
DROP TABLE producto;
DROP TABLE marca;
DROP TABLE categoria;
DROP TABLE usuario;
DROP TABLE proveedor;
DROP TABLE empleado;
DROP TABLE cliente;

--------------------------------------

CREATE TABLE cliente(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	ci TEXT NOT NULL,
	nombre TEXT NOT NULL,
	apPaterno TEXT NOT NULL,
	apMaterno TEXT NOT NULL,
	telefono INTEGER NOT NULL,
	UNIQUE(ci)
);

CREATE TABLE empleado(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	ci TEXT NOT NULL,
	nombre TEXT NOT NULL,
	apPaterno TEXT NOT NULL,
	apMaterno TEXT NOT NULL,
	telefono INTEGER NOT NULL,
	direccion TEXT NOT NULL,
	estado INTEGER NOT NULL,
	UNIQUE(ci)
);

CREATE TABLE proveedor(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	nombre TEXT NOT NULL,
	direccion TEXT NOT NULL,
	telefono INTEGER NOT NULL,
	estado INTEGER NOT NULL
);

CREATE TABLE usuario(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	usuario TEXT NOT NULL,
	passwd TEXT NOT NULL,
	urlImg TEXT NOT NULL,
	estado SMALLINT NOT NULL,
	id_empleado INTEGER NOT NULL,
	FOREIGN KEY(id_empleado) REFERENCES empleado(id)
);

CREATE TABLE categoria(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	nombre TEXT NOT NULL,
	descripcion TEXT NOT NULL
);

CREATE TABLE marca(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	nombre TEXT NOT NULL
);

CREATE TABLE producto(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	nombre TEXT NOT NULL,
	urlIMG TEXT NOT NULL,
	precio REAL NOT NULL,
	cantidad INTEGER NOT NULL,
	id_categoria INTEGER NOT NULL,
	id_marca INTEGER NOT NULL,
	FOREIGN KEY(id_categoria) REFERENCES categoria(id),
	FOREIGN KEY(id_marca) REFERENCES marca(id)
);


CREATE TABLE tipoMovimiento(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	nombre TEXT NOT NULL
);

CREATE TABLE movimiento(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	fecha DATE NOT NULL,
	total REAL NOT NULL,
	estado SMALLINT NOT NULL,
	id_proveedor INTEGER NOT NULL,
	id_cliente INTEGER NOT NULL,
	id_empleado INTEGER NOT NULL,
	id_tipoMovimiento INTEGER NOT NULL,
	FOREIGN KEY(id_cliente) REFERENCES cliente(id),
	FOREIGN KEY(id_proveedor) REFERENCES proveedor(id),
	FOREIGN KEY(id_empleado) REFERENCES empleado(id),
	FOREIGN KEY(id_tipoMovimiento) REFERENCES tipoMovimiento(id)
);

CREATE TABLE detalleMovimiento(
	id_movimiento INTEGER NOT NULL,
	id_producto INTEGER NOT NULL,
	cantidad INTEGER NOT NULL,
	precio REAL NOT NULL,
	FOREIGN KEY(id_movimiento) REFERENCES movimiento(id),
	FOREIGN KEY(id_producto) REFERENCES producto(id),
	PRIMARY KEY(id_movimiento, id_producto)
);


----------------------------------------------------------------

INSERT INTO cliente(id, ci, nombre, apPaterno, apMaterno, telefono) VALUES(1, '00000001', 'Anonimo', 'Anonimo', 'Anonimo', 0);
INSERT INTO cliente(ci, nombre, apPaterno, apMaterno, telefono) VALUES('13335162SC', 'Diego', 'Rojas', 'Justiniano', 62363203);
INSERT INTO cliente(ci, nombre, apPaterno, apMaterno, telefono) VALUES('11365140CB', 'Maria', 'Cortez', 'Vargaz', 62548683);
INSERT INTO cliente(ci, nombre, apPaterno, apMaterno, telefono) VALUES('15236463SC', 'Mauricio', 'Rocas', 'Rodriguez', 62548204);
INSERT INTO cliente(ci, nombre, apPaterno, apMaterno, telefono) VALUES('15037361BE', 'Fernanda', 'Rios', 'Costa', 62683990);
INSERT INTO cliente(ci, nombre, apPaterno, apMaterno, telefono) VALUES('15738229SC', 'Ruben', 'Guirrez', 'Roman', 62329812);
INSERT INTO cliente(ci, nombre, apPaterno, apMaterno, telefono) VALUES('10349648SC', 'Elias', 'Rivero', 'Borda', 62363203);

INSERT INTO empleado(ci, nombre, apPaterno, apMaterno, telefono, direccion, estado) VALUES('15674758SC', 'Juan Carlos', 'Gomez', 'Rivero', 62363203, 'Av. Beni, Calle Mendoza Nº 819', 0);
INSERT INTO empleado(ci, nombre, apPaterno, apMaterno, telefono, direccion, estado) VALUES('8191588SC', 'Jose Armando', 'Silva', 'Moro', 62363203, '7mo. Anillo Avenida Alemania', 0);
INSERT INTO empleado(ci, nombre, apPaterno, apMaterno, telefono, direccion, estado) VALUES('12849375LP', 'Carol', 'Nuñez', 'Prado', 62548683, 'Av. Lorenzo Palma Real, Calle B Nº 12', 0);
INSERT INTO empleado(ci, nombre, apPaterno, apMaterno, telefono, direccion, estado) VALUES('15892378SC', 'Mario', 'Roca', 'Gutierrez', 62548204, 'Av. Prada Norte, Calle Noche Blanca Nº 416', 0);
INSERT INTO empleado(ci, nombre, apPaterno, apMaterno, telefono, direccion, estado) VALUES('17430957OR', 'Fernanda', 'Rios', 'Costa', 62683990, 'Av. Manjatan, Calle C Nº 23', 0);
INSERT INTO empleado(ci, nombre, apPaterno, apMaterno, telefono, direccion, estado) VALUES('10185643SC', 'Ruben', 'Guirrez', 'Roman', 62329812, 'Av. Gongales Rivero, Calle Texas Nº 97', 0);
INSERT INTO empleado(ci, nombre, apPaterno, apMaterno, telefono, direccion, estado) VALUES('10357484SC', 'Matilda', 'Rojas', 'Salazar', 62363203, 'Av. 6 Anillo, Calle Norte Sur Nº 35', 0);

INSERT INTO usuario(usuario, passwd, urlImg, estado, id_empleado) VALUES('15674758SC', '5da495fd05f3b89af7192cddad37e387', 'https://res.cloudinary.com/dhswvlop2/image/upload/v1636145410/JuanCarlosGR_xz2udy.jpg', 0, 1); -- pasword: 3k36
INSERT INTO usuario(usuario, passwd, urlImg, estado, id_empleado) VALUES('8191588SC', '202cb962ac59075b964b07152d234b70', 'https://res.cloudinary.com/dhswvlop2/image/upload/v1636145410/JuanCarlosGR_xz2udy.jpg', 0, 2); -- pasword: 123
INSERT INTO usuario(usuario, passwd, urlImg, estado, id_empleado) VALUES('12849375LP', '79a802fa0d30a773892c2847d88fd5ca', 'https://res.cloudinary.com/dhswvlop2/image/upload/v1636145409/CarolNP_iwc6c8.jpg', 0, 3); -- pasword: fr3k
INSERT INTO usuario(usuario, passwd, urlImg, estado, id_empleado) VALUES('15892378SC', '716ffb96b0e1c60dc84a47eba7814c97', 'https://res.cloudinary.com/dhswvlop2/image/upload/v1636145409/MarioRG_dq5p2s.jpg', 0, 4); -- pasword: fd34
INSERT INTO usuario(usuario, passwd, urlImg, estado, id_empleado) VALUES('17430957OR', 'f5650704e2954da70ea0bd013631582c', 'https://res.cloudinary.com/dhswvlop2/image/upload/v1636145409/FernandaRC_jhjju9.jpg', 0, 5); -- pasword: h5g3
INSERT INTO usuario(usuario, passwd, urlImg, estado, id_empleado) VALUES('10185643SC', '221fac416f9a332e63840e6215ce8323', 'https://res.cloudinary.com/dhswvlop2/image/upload/v1636145409/RubenGR_bw4du2.jpg', 0, 6); -- pasword: 65h3
INSERT INTO usuario(usuario, passwd, urlImg, estado, id_empleado) VALUES('10357484SC', '62ccd9148b23575a01ecb61d44afeddd', 'https://res.cloudinary.com/dhswvlop2/image/upload/v1636145409/RubenGR_bw4du2.jpg', 0, 7); -- pasword: 2gf6

INSERT INTO categoria(nombre, descripcion) VALUES('Acción','Lucha y peleas. Basados en ejercicios de repetición.');
INSERT INTO categoria(nombre, descripcion) VALUES('Arcade','Plataformas, laberintos, aventuras. El usuario debe superar pantallas para seguir jugando.');
INSERT INTO categoria(nombre, descripcion) VALUES('Deportivo','Fútbol, tenis, baloncesto y conducción. Recrean diversos deportes.');
INSERT INTO categoria(nombre, descripcion) VALUES('Estrategia','Aventuras, rol, juegos de guerra. Consisten en trazar una estrategia para superar al contrincante.');
INSERT INTO categoria(nombre, descripcion) VALUES('Simulación','Aviones, simuladores de una situación o instrumentales… Permiten experimentar e investigar el funcionamiento de máquinas, fenómenos, situaciones y asumir el mando.');
INSERT INTO categoria(nombre, descripcion) VALUES('Juegos de mesa','Habilidad, preguntas y respuestas…La tecnología informática que sustituye al material tradicional del juego y hasta al adversario.');
INSERT INTO categoria(nombre, descripcion) VALUES('Juegos musicales','Juegos que inducen a la interacción del jugador con la música y cuyo objetivo es seguir los patrones de una canción.');

INSERT INTO marca(nombre) VALUES('SEGA');
INSERT INTO marca(nombre) VALUES('CAPCOM');
INSERT INTO marca(nombre) VALUES('NINTENDO');
INSERT INTO marca(nombre) VALUES('UBISOFT');
INSERT INTO marca(nombre) VALUES('RAW FURY');
INSERT INTO marca(nombre) VALUES('AKSYS GAMES');
INSERT INTO marca(nombre) VALUES('XSEED');
INSERT INTO marca(nombre) VALUES('505 GAMES');
INSERT INTO marca(nombre) VALUES('MOJANG');

INSERT INTO proveedor(nombre, direccion, telefono, estado) VALUES ('Gamestore', 'Comercial casco viejo local # 25 PB. Calle 21 de mayo esquina junin., 591 Santa Cruz de la Sierra, Bolivia', 70806174, 0);
INSERT INTO proveedor(nombre, direccion, telefono, estado) VALUES ('VYMaps', '3er anillo interno y Av. Alemana, Pasillo 5, Local # 140, Santa Cruz de la Sierra, Bolivia', 72601228, 0);
INSERT INTO proveedor(nombre, direccion, telefono, estado) VALUES ('Central Videojuegos', 'Centro Comercial Norte Pasillo 5 local 140 Santa Cruz de la Sierra, Bolivia', 73280723, 0);
INSERT INTO proveedor(nombre, direccion, telefono, estado) VALUES ('Just Games', 'Centro Comercial Norte Pasillo 5 local 140 Santa Cruz de la Sierra, Bolivia', 73280723, 0);
INSERT INTO proveedor(nombre, direccion, telefono, estado) VALUES ('OMG Juegos', 'Centro Comercial Norte Pasillo 52 local 320 Santa Cruz de la Sierra, Bolivia', 78490852, 0);

INSERT INTO producto(nombre, urlIMG, precio, cantidad, id_categoria, id_marca) VALUES('Resident Evil 2 (PlayStation 4)', 'https://media.vandal.net/m/32818/resident-evil-2-remake-20191141048287_1.jpg', 420, 12, 1, 2);
INSERT INTO producto(nombre, urlIMG, precio, cantidad, id_categoria, id_marca) VALUES('Assassin Creed: Valhalla (PC)', 'https://sm.ign.com/t/ign_es/screenshot/a/assassins-/assassins-creed-valhalla-box-art_rua2.1080.jpg', 360, 18, 1, 4);
INSERT INTO producto(nombre, urlIMG, precio, cantidad, id_categoria, id_marca) VALUES('Far Cry 6 (PC)', 'https://image.api.playstation.com/vulcan/img/rnd/202106/1514/fkPaEpz998Uu7QaofSj1VIhr.png', 420, 7, 1, 4);
INSERT INTO producto(nombre, urlIMG, precio, cantidad, id_categoria, id_marca) VALUES('Minecraft (PC)', 'https://image.api.playstation.com/vulcan/img/cfn/11307uYG0CXzRuA9aryByTHYrQLFz-HVQ3VVl7aAysxK15HMpqjkAIcC_R5vdfZt52hAXQNHoYhSuoSq_46_MT_tDBcLu49I.png', 20, 30, 2, 9);
INSERT INTO producto(nombre, urlIMG, precio, cantidad, id_categoria, id_marca) VALUES('Tetris (PC)', 'https://files.merca20.com/uploads/2019/06/tetris.jpg', 10, 8, 2, 1);


INSERT INTO tipoMovimiento(nombre) VALUES('Compra');
INSERT INTO tipoMovimiento(nombre) VALUES('Venta');

INSERT INTO cliente(id, ci, nombre, apPaterno, apMaterno, telefono) VALUES(0, '00000000', 'Sin Cliente', 'Sin Cliente', 'Sin Cliente', 0);
INSERT INTO proveedor(id, nombre, direccion, telefono, estado) VALUES (0, 'Sin Proveedor', 'Sin direccion', 0, 0);
