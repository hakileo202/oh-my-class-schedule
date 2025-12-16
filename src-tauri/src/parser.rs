use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Course {
    pub name: String,
    pub section: String,
    pub time: String,
    pub connection: String, // The week/day line
    pub location: String,
    pub teacher: String,
}

pub fn parse_schedule_file(content: &str) -> Result<Vec<Course>, String> {
    let mut courses = Vec::new();
    let mut current_section = String::new();

    // Trim and filter empty lines
    let lines = content.lines().map(|l| l.trim()).filter(|l| !l.is_empty());
    let mut peekable = lines.peekable();

    while let Some(line) = peekable.next() {
        if line.ends_with("大节") {
            current_section = line.to_string();
            // If the next line is also a section header (e.g. consecutive headers?), continue
            // But usually after header comes course.
            // Check if next line is course or another header?
            // If next line ends with "大节", loop again.
            while let Some(next_line) = peekable.peek() {
                if next_line.ends_with("大节") {
                    current_section = peekable.next().unwrap().to_string();
                } else {
                    break;
                }
            }
            // Check if we ran out of lines
            if peekable.peek().is_none() {
                break;
            }
            // Re-read next line as course name if we are not at end
            // Actually, the loop continues, picking up next line as `line`.
            // But we consumed `line` as header.
            // We need to proceed to next iteration to read course name.
            continue;
        }

        // precise course block parsing
        let name = line.to_string();

        let time = match peekable.next() {
            Some(l) => l.to_string(),
            None => return Err("Unexpected end of file while parsing time".to_string()),
        };

        let connection = match peekable.next() {
            Some(l) => l.to_string(),
            None => return Err("Unexpected end of file while parsing weeks/day".to_string()),
        };

        let location = match peekable.next() {
            Some(l) => l.to_string(),
            None => return Err("Unexpected end of file while parsing location".to_string()),
        };

        let teacher = match peekable.next() {
            Some(l) => l.to_string(),
            None => return Err("Unexpected end of file while parsing teacher".to_string()),
        };

        courses.push(Course {
            name,
            section: current_section.clone(),
            time,
            connection,
            location,
            teacher,
        });
    }

    Ok(courses)
}
