"""
Random American Name Generator
Generates realistic American names for blog post authors
"""
import random

# Balanced mix of male and female names, including diverse American names
FIRST_NAMES = [
    # Male names
    "James", "John", "Robert", "Michael", "William",
    "David", "Richard", "Joseph", "Thomas", "Christopher",
    "Daniel", "Matthew", "Anthony", "Mark", "Donald",
    "Steven", "Paul", "Andrew", "Joshua", "Kenneth",
    "Kevin", "Brian", "George", "Edward", "Ronald",
    "Timothy", "Jason", "Jeffrey", "Ryan", "Jacob",
    "Gary", "Nicholas", "Eric", "Jonathan", "Stephen",
    
    # Female names
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth",
    "Barbara", "Susan", "Jessica", "Sarah", "Karen",
    "Nancy", "Lisa", "Betty", "Margaret", "Sandra",
    "Ashley", "Dorothy", "Kimberly", "Emily", "Donna",
    "Michelle", "Carol", "Amanda", "Melissa", "Deborah",
    "Stephanie", "Rebecca", "Laura", "Sharon", "Cynthia",
    "Kathleen", "Amy", "Shirley", "Angela", "Helen",
    
    # Diverse American names
    "Carlos", "Jose", "Juan", "Luis", "Miguel",
    "Maria", "Sofia", "Isabella", "Camila", "Valentina",
    "Chen", "Wei", "Mei", "Amir", "Fatima"
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones",
    "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris",
    "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright",
    "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall",
    "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
]


def get_random_american_name() -> str:
    """
    Generate a random American name by combining a first and last name.
    
    Returns:
        str: A full name like "John Smith"
    """
    first = random.choice(FIRST_NAMES)
    last = random.choice(LAST_NAMES)
    return f"{first} {last}"


def get_multiple_random_names(count: int) -> list[str]:
    """
    Generate multiple unique random American names.
    
    Args:
        count: Number of names to generate
        
    Returns:
        list: List of unique full names
    """
    names = set()
    attempts = 0
    max_attempts = count * 10  # Prevent infinite loop
    
    while len(names) < count and attempts < max_attempts:
        names.add(get_random_american_name())
        attempts += 1
    
    return list(names)


# Quick test when run directly
if __name__ == "__main__":
    print("Random American Name Generator Test")
    print("=" * 50)
    print("\nGenerating 10 random names:\n")
    
    for i in range(10):
        print(f"{i+1}. {get_random_american_name()}")
    
    print("\n" + "=" * 50)
    print(f"Total possible combinations: {len(FIRST_NAMES)} x {len(LAST_NAMES)} = {len(FIRST_NAMES) * len(LAST_NAMES):,}")
