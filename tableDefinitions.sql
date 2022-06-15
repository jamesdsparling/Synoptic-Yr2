drop table if exists profiles cascade;
drop table if exists polygons cascade;
drop table if exists messages cascade;
drop type if exists poly_type;

create table profiles (
  profile_ID SERIAL primary key,
  email varchar(100) not null unique,
  pass varchar(50) not null,
  admin bool not null default false
);


create table polygons (
  poly_ID SERIAL primary key,
  type varchar(100) not null,
  data double precision[][] not null
);

create table messages (
  messageID SERIAL primary key,
  fromProfile int not null references profiles(profile_ID) ON DELETE CASCADE,
  toProfile int not null references profiles(profile_ID) ON DELETE CASCADE,
  message varchar(300)
);