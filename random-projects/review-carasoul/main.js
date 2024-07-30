document.addEventListener('DOMContentLoaded', (e) => {
    class Person {
        constructor(name, profession, image, description) {
            this.name = name;
            this.profession = profession;
            this.image = image;
            this.description = description;
        }
    }

   const people = [
        new Person('Alice Johnson', 'Software Engineer', 'https://cdn.pixabay.com/photo/2021/06/15/16/11/man-6339003_640.jpg', 'Alice specializes in backend development, creating efficient and scalable server-side applications. She has a knack for solving complex algorithms and optimizing database queries.'),
        new Person('Brian Martinez', 'Graphic Designer', 'https://cdn.pixabay.com/photo/2016/11/22/21/42/woman-1850703_640.jpg', 'Brian is a creative professional who excels in visual storytelling. He has a keen eye for detail and is proficient in various design software, producing stunning graphics and layouts.'),
        new Person('Catherine Nguyen', 'Marketing Manager', 'https://cdn.pixabay.com/photo/2019/11/03/20/11/portrait-4599553_640.jpg', 'Catherine is an expert in digital marketing strategies. She has a proven track record in increasing brand awareness and driving sales through innovative marketing campaigns.'),
        new Person('David Kim', 'Financial Analyst', 'https://cdn.pixabay.com/photo/2022/12/24/21/14/portrait-7676482_640.jpg', 'David has strong analytical skills and a deep understanding of financial markets. He provides insights and recommendations to help the company make informed financial decisions.'),
        new Person('Emma Thompson', 'Human Resources Specialist', 'https://cdn.pixabay.com/photo/2020/09/18/05/58/lights-5580916_640.jpg', 'Emma is dedicated to fostering a positive work environment. She handles recruitment, employee relations, and benefits administration with a focus on employee satisfaction and retention.'),
        new Person('Felix Lopez', 'Product Manager', 'https://cdn.pixabay.com/photo/2016/03/27/16/54/face-1283106_640.jpg', 'Felix is responsible for overseeing the development and launch of new products. He collaborates with cross-functional teams to ensure products meet market demands and customer needs.'),
        new Person('Grace Patel', 'Data Scientist', 'https://cdn.pixabay.com/photo/2019/03/09/20/30/international-womens-day-4044939_640.jpg', 'Grace excels in extracting insights from large datasets. She uses advanced statistical techniques and machine learning models to drive data-driven decision-making.'),
        new Person('Hector Rivera', 'Sales Executive', 'https://cdn.pixabay.com/photo/2014/04/12/14/59/portrait-322470_640.jpg', 'Hector has a talent for building strong client relationships and closing deals. His persuasive communication skills and deep product knowledge make him a top performer in sales.'),
        new Person('Isabella Rossi', 'UX/UI Designer', 'https://cdn.pixabay.com/photo/2015/03/03/08/55/portrait-657116_640.jpg', 'Isabella focuses on creating user-friendly interfaces and enhancing the user experience. She conducts user research and implements design principles to improve product usability.'),
        new Person('Jack Miller', 'IT Support Specialist', 'https://cdn.pixabay.com/photo/2023/01/28/20/23/ai-generated-7751688_640.jpg', 'Jack provides technical support and troubleshooting for hardware and software issues. He is known for his quick problem-solving skills and excellent customer service.')
    ];

  let currentIndex = 0;

  const updatePersonInfo = (index) => {
    const person = people[index];
  document.getElementById('name').innerText = person.name;
  document.getElementById('profession').innerText = person.profession;
  document.getElementById('image').src = person.image;
  document.getElementById('description').innerText = person.description;
  }

  document.getElementById('left').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + people.length) % people.length;
    updatePersonInfo(currentIndex);
});

document.getElementById('right').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % people.length;
    updatePersonInfo(currentIndex);
});

document.getElementById('surprise').addEventListener('click', () => {
    currentIndex = Math.floor(Math.random() * people.length);
    updatePersonInfo(currentIndex);

    updatePersonInfo(currentIndex);
});
});

