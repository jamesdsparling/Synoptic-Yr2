create table profiles (
  profileID SERIAL primary key,
  email varchaar(100) not null unique,
  pass varchar(50) not null,
  admin bool not null default false
);

create table polygons (
  polyID SERIAL primary key,
  type ENUM('fire', 'water', 'coral') not null,
  data varchar(100) not null,
  adminApproved bool not null default false
);

create table messages (
  messageID SERIAL primary key,
  fromProfile int not null references profiles(profileID) ON DELETE CASCADE,
  toProfile int not null references profiles(profileID) ON DELETE CASCADE,
  message varchar(300)
)