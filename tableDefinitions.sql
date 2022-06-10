drop table if exists profiles;
drop table if exists polygons;
drop table if exists messages;

create table profiles (
  profile_ID SERIAL primary key,
  email varchar(100) not null unique,
  pass varchar(50) not null,
  admin bool not null default false
);
insert into profiles (email, pass, admin) values
('defaultuser', 'defaultpass', true);


create type polyType as ENUM ('fire', 'water', 'coral');

create table polygons (
  poly_ID SERIAL primary key,
  type polyType not null,
  data varchar(100) not null,
  admin_approved bool not null default false,
  popup_message varchar(100)
);

create table messages (
  message_ID SERIAL primary key,
  from_profile int not null references profiles(profileID) ON DELETE CASCADE,
  to_profile int not null references profiles(profileID) ON DELETE CASCADE,
  message varchar(300)
)