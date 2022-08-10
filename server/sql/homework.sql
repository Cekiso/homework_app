create table user_detail(
    id serial not null primary key,
    first_name text not null,
    lastname text not null,
    username text not null,
    password text null,
    role text not null
);

create table subject_table(
    id serial not null primary key,
    add_subject text not null
);

create table topic_table(
    id serial not null primary key,
    topic text not null,
    subject_id int ,
    foreign key (subject_id) references subject_table(id)
);

create table questions_table(
    id serial not null primary key,
    questions text not null,
    topic_id int not null,
    foreign key (topic_id) references topic_table(id)
);

create table answers_table(
    id serial not null primary key,
    answer text,
    correct boolean,
    questions_id int,
    foreign key (questions_id) references questions_table(id)
);

create table attempts_table(
    id serial not null primary key,
    student_id int not null,
    question_id int not null,
    attempt_1 int,
    attempt_2 int,
    attempt_3 int,
    foreign key (student_id) references user_detail(id),
    foreign key (question_id) references questions_table(id)
);


