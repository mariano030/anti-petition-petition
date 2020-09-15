SELECT * FROM singers 
JOIN songs 
ON singers.id = songs.singer_id  // because both tables have an id field, i need to use dot notation
// can give you identical column names!

// inner join, left, right and outer join - check notes 
// good article https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/
// inner JOIN - info in both tables
// outer JOIN - we get all rows even if no match between joined tables
// left JOIN - makes the first table in querry be fully represented even without  matches

SELECT singers.id, singers.name AS singer_name, songs.name AS song_name FROM singers JOIN songs ON singers.id = songs.singer_id
// AS for renaming temporary - select querry - tables

// 