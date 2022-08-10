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

displayHomeworkForKids() {

            const topic = this.topicname

            console.log('eyyyyy ' + this.clickedAnswer)
            axios
                .get(`http://localhost:8585/api/qAndA/${topic}`)
                .then((result) => {
                    console.log('first Q&A' + JSON.stringify(result.data))

                    if (result.data.status == 'successful') {

                        this.kidQuestion = result.data.data[this.i].question
                        this.kidAnswers = result.data.data[this.i].answers
                        this.question = result.data.data[this.i].question

                        if (this.clickedAnswer == true && this.i == result.data.data.length - 1) {

                                this.kidQuestion = 'Homework finished!'
                                this.kidAnswers = null
                                // this.successMessage = 'Done!'
                                console.log('beyonce')
                          
                        }

                        else if (this.clickedAnswer == false) {
                            this.successMessage = 'Try again'

                            const studentId = this.studentId
                            const question = this.question
                            
                            axios
                                .post('http://localhost:8585/api/kidsAttempt', { studentId, question })
                                .then((result) => {
                                    console.log(result.data)
                                })

                            axios
                                .put('http://localhost:8585/api/recordAttempts', { studentId, question })
                                .then((result) => {
                                    console.log(result.data)
                                    if(result.data.data == 'recorded attempt 3' && this.clickedAnswer == false){
                                        this.i += 1
                                       
                                    }

                                    else if (this.clickedAnswer == true) {
                                        this.successMessage = 'Correct!'
                                        this.i += 1
                                    }
                                })
                        }

                      
                    }
      
                    else {
                        this.kidQuestion = result.data.status
                        this.kidAnswers = null
                    }

                    setTimeout(() => {
                        this.successMessage = '';
                        this.errorMessage = '';
                    }, 3000);
                })
        },


