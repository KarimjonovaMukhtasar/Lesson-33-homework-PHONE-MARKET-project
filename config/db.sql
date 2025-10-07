-- Active: 1759236905510@@127.0.0.1@5432@phone
create database phone;

create table brand(id serial primary key,
        name varchar not null);

create table model(id serial primary key,
        brand_id int references brand(id) on delete cascade,
        name varchar not null);

create type color_enum as enum ('Black', 'Blue', 'White', 'Red', 'Grey', 'Pink');

create table phone(id bigserial primary key,
        name varchar not null,
        price decimal(10,2),
        brand_id smallint REFERENCES brand(id),
        model_id smallint REFERENCES model(id),
        color color_enum default 'Black',
        display decimal(2,1),
        ram varchar,
        memory varchar);

select * from phone;

create table customer(id bigserial primary key,
        name varchar not null,
        phone_number varchar not null);

create type status_enum as enum('Pending', 'Accepted', 'Rejected');

create table "order" (id bigserial primary key,
        customer_id bigint REFERENCES customer(id),
        total_price decimal(10,2),
        order_date timestamp default now(),
        order_status status_enum default 'Pending'
);

create table order_detail(id bigserial primary key,
        order_id bigint REFERENCES "order"(id),
        phone_id bigint REFERENCES phone(id),
        quantity smallint not null)