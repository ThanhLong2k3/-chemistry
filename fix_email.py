import subprocess

OLD_EMAILS = ["longpt@aiacademy.edu.vn", "jaykergg@gmail.com"]
CORRECT_EMAIL = "phuonglinh11824@gmail.com"

def fix_email():
    command = [
        "git", "filter-repo",
        "--commit-callback",
        f'''
import sys
OLD_EMAILS = {OLD_EMAILS}
CORRECT_EMAIL = "{CORRECT_EMAIL}"

if commit.author_email in OLD_EMAILS:
    commit.author_email = CORRECT_EMAIL

if commit.committer_email in OLD_EMAILS:
    commit.committer_email = CORRECT_EMAIL
'''
    ]

    subprocess.run(command, shell=True, check=True)

if __name__ == "__main__":
    fix_email()
