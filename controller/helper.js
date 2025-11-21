const getRandomCountryByName = (name) => {
    const countryMap = {
      // Western/Christian
      en: ["US", "CA", "GB", "AU", "DE", "FR", "IT", "ES"],
  
      // Muslim/Arabic
      ar: ["SA", "AE", "EG", "OM", "QA", "KW", "BH", "PK"],
  
      // Hindu/Sanskrit
      in: ["IN", "LK", "BD", "NP"],
  
      // Jewish/Hebrew
      il: ["IL"],
  
      // East Asian
      ea: ["CN", "JP", "KR", "SG"],
  
      // African
      af: ["NG", "GH", "KE", "ZA", "EG"],
  
      // Native American
      na: ["US", "MX", "PE"],
  
      // South American/Spanish, Portuguese
      sa: ["AR", "BR", "CL", "CO", "VE", "MX"],
  
      // Russian/Eastern European
      ee: ["RU", "UA", "PL", "CZ", "RO"],
  
      // Global/International
      global: ["US", "GB", "AU", "DE", "FR", "CA"],
    };
  
    const nameCategories = {
      en: [
        "Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Hannah", 
        "Ivy", "Jack", "Katherine", "Liam", "Mia", "Noah", "Olivia", "Paul",
      ],
      ar: ["Ahmed", "Amina", "Fatima", "Hassan", "Ibrahim", "Khadija", "Layla", "Mohammed"],
      in: ["Aarav", "Ananya", "Divya", "Gaurav", "Isha", "Kiran", "Lakshmi", "Manish"],
      il: ["Avi", "Baruch", "Chana", "David", "Eliana", "Gideon", "Hannah", "Isaac"],
      ea: ["Akira", "Hiroshi", "Kenji", "Mei", "Rina", "Chen", "Li", "Wen"],
      af: ["Amani", "Binta", "Chinua", "Dayo", "Ekene", "Femi", "Imani", "Jabari"],
      na: ["Aiyana", "Chayton", "Elu", "Hania", "Kohana", "Mika", "Nayeli", "Ona"],
      sa: ["Carlos", "Maria", "Fernando", "Isabella", "Julio", "Lucia", "Mateo", "Rosa"],
      ee: ["Anastasia", "Boris", "Dmitri", "Ekaterina", "Fyodor", "Igor", "Leonid", "Mikhail"],
      global: ["Abigail", "Benjamin", "Charlotte", "Daniel", "Emma", "Freya", "Henry", "James"],
    };
  
    // Find the category for the given name
    let selectedCategory = "global"; // Default category
    Object.keys(nameCategories).forEach((key) => {
      if (nameCategories[key].includes(name)) {
        selectedCategory = key;
      }
    });
  
    // Get a random country from the selected category
    const countries = countryMap[selectedCategory];
    const randomIndex = Math.floor(Math.random() * countries.length);
    return countries[randomIndex];
  };

const names = {
    en: [
      // Western/Christian
  'Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Hannah', 'Ivy', 'Jack', 
  'Katherine', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quincy', 'Rachel', 'Sophia', 'Thomas',
  'Ursula', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zachary', 'Aiden', 'Bella', 'Carter', 'Daisy', 
  'Ethan', 'Fiona', 'George', 'Harper', 'Isaac', 'Jasmine', 'Kevin', 'Luna', 'Mason', 'Nora',
  'Oscar', 'Peyton', 'Quinn', 'Ryan', 'Samantha', 'Tyler', 'Ulysses', 'Violet', 'Willow', 'Xena', 
  'Yvonne', 'Zane', 'Aaron', 'Brenda', 'Colin', 'Diana', 'Elena', 'Felix', 'Gabriel', 'Hazel',
  
  // Muslim/Arabic
  'Ahmed', 'Amina', 'Fatima', 'Hassan', 'Ibrahim', 'Khadija', 'Layla', 'Mohammed', 'Nadia', 'Omar', 
  'Rashid', 'Said', 'Tariq', 'Yusuf', 'Zainab', 'Ali', 'Amira', 'Basma', 'Faisal', 'Huda', 
  'Jamal', 'Karim', 'Leila', 'Mahmoud', 'Nasir', 'Rania', 'Salim', 'Yara', 'Zayd',

  // Hindu/Sanskrit
  'Aarav', 'Ananya', 'Divya', 'Gaurav', 'Isha', 'Kiran', 'Lakshmi', 'Manish', 'Nisha', 'Rajesh', 
  'Sanjay', 'Tanvi', 'Vikram', 'Aditi', 'Arjun', 'Bhavana', 'Chandni', 'Dhruv', 'Gita', 'Hari', 
  'Jaya', 'Krishna', 'Lalita', 'Meera', 'Naveen', 'Parvati', 'Ravi', 'Shivani', 'Vishal',

  // Jewish/Hebrew
  'Avi', 'Baruch', 'Chana', 'David', 'Eliana', 'Gideon', 'Hannah', 'Isaac', 'Judith', 'Levi', 
  'Miriam', 'Noam', 'Rachel', 'Samuel', 'Talia', 'Yael', 'Zev', 'Eli', 'Naomi', 'Shoshana',

  // East Asian/Chinese, Japanese, Korean
  'Akira', 'Hiroshi', 'Kenji', 'Mei', 'Rina', 'Satoshi', 'Takumi', 'Yuki', 'Chen', 'Li', 
  'Wen', 'Xiao', 'Yan', 'Yu', 'Zhi', 'Jin', 'Min', 'Sun', 'Hye', 'Soo', 
  'Jung', 'Kang', 'Jin', 'Hyun', 'Ji', 'Dong', 'Eun', 'Ha', 'Yoon',

  // African
  'Amani', 'Binta', 'Chinua', 'Dayo', 'Ekene', 'Femi', 'Imani', 'Jabari', 'Kofi', 'Lulu', 
  'Mwangi', 'Nia', 'Olu', 'Penda', 'Sade', 'Tunde', 'Zuri', 'Kwame', 'Aisha', 'Chidi',

  // Native American
  'Aiyana', 'Chayton', 'Elu', 'Hania', 'Kohana', 'Mika', 'Nayeli', 'Ona', 'Tala', 'Wapi', 
  'Dakota', 'Cheyenne', 'Sequoyah', 'Takoda', 'Aponi', 'Kaya', 'Tiva', 'Nizhoni', 'Yonah', 'Zuni',

  // South American/Spanish, Portuguese
  'Carlos', 'Maria', 'Fernando', 'Isabella', 'Julio', 'Lucia', 'Mateo', 'Rosa', 'Santiago', 'Valentina', 
  'Diego', 'Camila', 'Sebastian', 'Gabriela', 'Miguel', 'Alejandra', 'Eduardo', 'Andrea', 'Juan', 'Pablo',

  // Russian/Eastern European
  'Anastasia', 'Boris', 'Dmitri', 'Ekaterina', 'Fyodor', 'Galina', 'Igor', 'Katya', 'Leonid', 'Mikhail', 
  'Nina', 'Olga', 'Pavel', 'Tatiana', 'Vladimir', 'Yuri', 'Svetlana', 'Arkady', 'Marina', 'Sergei',

  // Other Global/International Names
  'Abigail', 'Benjamin', 'Charlotte', 'Daniel', 'Emma', 'Freya', 'Henry', 'Isabella', 'James', 'Lucas', 
  'Michael', 'Natalie', 'Oliver', 'Rebecca', 'Sarah', 'Theodore', 'Victoria', 'William', 'Xander', 'Yara'
  ]
  };

module.exports = {
    getRandomCountryByName,
    names
  }