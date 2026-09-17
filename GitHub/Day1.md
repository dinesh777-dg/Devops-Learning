# Git Fundamentals

## 1. What is DVCS?

**DVCS** stands for **Distributed Version Control System**.

In a DVCS, every developer has a **complete copy of the repository**, including the project files and its version history, on their local machine.

**Git** is one of the most widely used Distributed Version Control Systems.

Unlike a centralized system, developers can perform most Git operations locally without continuously depending on a central server.

### How DVCS works

A typical Git environment contains:

* **Working Directory**: Where files are created and modified.
* **Staging Area**: Where changes are selected before committing.
* **Local Repository**: Stores committed changes and complete version history locally.
* **Remote Repository**: A shared repository hosted on platforms such as GitHub, GitLab, or Bitbucket.

---

## 2. DVCS vs CVCS

### What is CVCS?

**CVCS** stands for **Centralized Version Control System**.

In a centralized system, the main version history is maintained on a central server. Developers generally need to communicate with this server for many version-control operations.

Examples include:

* SVN
* CVS
* Perforce

### DVCS vs CVCS

| Feature               | DVCS                                  | CVCS                                   |
| --------------------- | ------------------------------------- | -------------------------------------- |
| Repository            | Full copy on each developer's machine | Mainly maintained on central server    |
| Network dependency    | Low for most operations               | Higher                                 |
| Commit                | Can commit locally                    | Usually requires central server        |
| Speed                 | Most operations are fast              | Can depend on network/server           |
| Offline work          | Supported                             | Limited                                |
| History               | Available locally                     | Primarily maintained centrally         |
| Server failure impact | Lower                                 | Higher                                 |
| Branching             | Generally lightweight and convenient  | Often more dependent on central system |

### Advantages of DVCS over CVCS

#### 1. Offline work

Since the complete repository is available locally, developers can perform many operations without an internet connection.

For example:

```bash
git add .
git commit -m "Update application configuration"
git log
```

These commands work against the local repository and do not require GitHub to be available.

#### 2. Faster operations

Most Git operations are performed locally.

For example:

```bash
git log
```

does not need to contact the remote repository.

#### 3. Complete version history

Each developer normally has the repository history locally, making it easier to inspect previous versions and changes.

#### 4. Easy branching and merging

Git makes it practical to create branches for features, bug fixes, testing, and releases.

Example:

```bash
git branch feature-login
git switch feature-login
```

#### 5. Better resilience

Because repository data is distributed across multiple machines, losing access to the central Git server does not necessarily mean losing all local repository history.

#### 6. Flexible collaboration

Developers can work independently and later synchronize their changes with a shared remote repository.

---

# 3. Git Working Flow

A basic Git workflow can be represented as:

```text
                   GIT WORKFLOW

┌───────────────────┐
│  Working Directory│
│                   │
│  Create / Modify  │
│       files       │
└─────────┬─────────┘
          │
          │ git add
          ▼
┌───────────────────┐
│   Staging Area    │
│                   │
│ Changes selected  │
│ for next commit   │
└─────────┬─────────┘
          │
          │ git commit
          ▼
┌───────────────────┐
│    Local Repo     │
│                   │
│ Committed history │
│ stored locally    │
└─────────┬─────────┘
          │
          │ git push
          ▼
┌───────────────────┐
│    Remote Repo    │
│                   │
│ GitHub / GitLab   │
│ / Bitbucket       │
└───────────────────┘
```

### Understanding the four stages

**Working Directory**

This is the directory where you actually create, modify, or delete files.

↓

**Staging Area**

The staging area contains the changes you have selected for the next commit.

↓

**Local Repository**

When you commit, Git stores those staged changes in your local repository along with a commit ID.

↓

**Remote Repository**

The committed changes can then be uploaded to a shared remote repository using:

```bash
git push
```

---

# 4. `git add`

## Purpose

`git add` moves changes from the **Working Directory to the Staging Area**.

It tells Git:

> "Include these changes in my next commit."

### Add a specific file

```bash
git add filename.txt
```

Example:

```bash
git add index.html
```

### Add multiple files

```bash
git add file1.txt file2.txt
```

### Add all modified and new files

```bash
git add .
```

### Example workflow

Suppose you modify:

```text
index.html
style.css
```

Check the status:

```bash
git status
```

Then stage the files:

```bash
git add index.html style.css
```

Check again:

```bash
git status
```

The files should now appear under:

```text
Changes to be committed
```

### Important

`git add` **does not create a commit**.

It only moves the selected changes into the staging area.

---

# 5. `git commit`

## Purpose

`git commit` saves the staged changes into the **Local Repository**.

A commit represents a snapshot of the project at a particular point in time.

### Basic syntax

```bash
git commit -m "commit message"
```

Example:

```bash
git commit -m "Add login page"
```

### Typical workflow

```bash
git add index.html
git commit -m "Update index page"
```

The flow is:

```text
Working Directory
       │
       │ git add
       ▼
Staging Area
       │
       │ git commit
       ▼
Local Repository
```

### Good commit messages

Prefer clear and meaningful messages:

```bash
git commit -m "Add user authentication"
```

```bash
git commit -m "Fix database connection issue"
```

```bash
git commit -m "Update production configuration"
```

Avoid vague messages such as:

```bash
git commit -m "changes"
```

or:

```bash
git commit -m "update"
```

---

# 6. `git restore`

`git restore` is used to restore files or remove changes from a particular Git state.

One common use is to **discard changes in the Working Directory**.

## Example

Suppose you modify:

```text
config.txt
```

but decide that you don't want the changes.

Check the status:

```bash
git status
```

Then:

```bash
git restore config.txt
```

Git restores the file to the version from the latest commit.

### Important

Be careful with:

```bash
git restore config.txt
```

Any **uncommitted changes** in that file can be discarded.

---

## Unstage a file

`git restore` can also move a file from the **Staging Area back to the Working Directory**.

```bash
git restore --staged config.txt
```

Example:

```bash
git add config.txt
```

The file is now staged.

To unstage it:

```bash
git restore --staged config.txt
```

The changes are still present in the Working Directory. They are simply no longer staged.

### Summary

```text
git restore file.txt
        │
        └── Discard working-directory changes

git restore --staged file.txt
        │
        └── Unstage the file
```

---

# 7. `git rm --cached`

## Purpose

`git rm --cached` removes a file from **Git tracking** while keeping the physical file in your Working Directory.

This is particularly useful when you accidentally add a file to Git that should not be tracked.

### Example

Suppose you accidentally staged:

```text
password.txt
```

You want the file to remain on your computer but remove it from Git's tracking.

Run:

```bash
git rm --cached password.txt
```

The file remains physically present in your directory, but Git no longer tracks it after the change is committed.

### Common use with `.gitignore`

For example, suppose you accidentally committed a log file:

```text
application.log
```

Add it to `.gitignore`:

```text
application.log
```

Then remove it from Git's index:

```bash
git rm --cached application.log
```

Commit the change:

```bash
git add .gitignore
git commit -m "Stop tracking application log"
```

### Difference between `git rm` and `git rm --cached`

```bash
git rm file.txt
```

Removes the file from both Git and the Working Directory.

```bash
git rm --cached file.txt
```

Removes the file from Git tracking but **keeps the file in the Working Directory**.

---

# 8. `git log`

## Purpose

`git log` displays the **commit history** of the repository.

Basic command:

```bash
git log
```

Example output:

```text
commit 8f31c9d2...
Author: Dinesh
Date:   Tue Sep 16 10:20:15 2026

    Add login functionality

commit 72ab45e1...
Author: Dinesh
Date:   Mon Sep 15 16:30:10 2026

    Update application configuration

commit 45cd812a...
Author: Dinesh
Date:   Mon Sep 15 11:15:32 2026

    Initial project setup
```

A commit normally contains information such as:

* Commit ID / SHA
* Author
* Date
* Commit message

### Why `git log` is useful

You can use it to:

* Review project history
* Find previous commits
* Identify who made a change
* Find a specific commit ID
* Investigate when changes were introduced

---

# 9. `git log --oneline`

## Purpose

`git log --oneline` displays the commit history in a **short and compact format**.

Command:

```bash
git log --oneline
```

Example:

```text
8f31c9d Add login functionality
72ab45e Update application configuration
45cd812 Initial project setup
```

Compared with regular `git log`:

```text
git log
```

provides detailed information.

While:

```text
git log --oneline
```

provides a concise history.

### Why it is useful

It is especially convenient when you want to quickly identify commit IDs.

For example:

```text
8f31c9d Add login functionality
72ab45e Update application configuration
45cd812 Initial project setup
```

You can then use a commit ID for other Git operations.

---

# 10. Command Summary

| Command                     | Purpose                 | Main Effect                                 |
| --------------------------- | ----------------------- | ------------------------------------------- |
| `git add`                   | Stage changes           | Working Directory → Staging Area            |
| `git commit`                | Save staged changes     | Staging Area → Local Repository             |
| `git restore file`          | Discard working changes | Restores file                               |
| `git restore --staged file` | Unstage a file          | Staging Area → Working Directory            |
| `git rm --cached file`      | Stop tracking a file    | Removes from Git tracking, keeps local file |
| `git log`                   | View commit history     | Detailed history                            |
| `git log --oneline`         | View compact history    | Short commit history                        |

---

# 11. Complete Example

Consider a simple project:

```text
my-project/
├── index.html
├── style.css
└── README.md
```

Modify `index.html` and check the status:

```bash
git status
```

Stage the change:

```bash
git add index.html
```

Commit the change:

```bash
git commit -m "Update homepage"
```

View the commit history:

```bash
git log
```

View it in a compact format:

```bash
git log --oneline
```

If you modify `index.html` again but decide to discard the change:

```bash
git restore index.html
```

If you stage a file by mistake:

```bash
git add README.md
```

Unstage it:

```bash
git restore --staged README.md
```

If a file should remain on your computer but should no longer be tracked by Git:

```bash
git rm --cached README.md
```

---

# 12. Key Points to Remember

```text
git add
    ↓
Working Directory → Staging Area

git commit
    ↓
Staging Area → Local Repository

git push
    ↓
Local Repository → Remote Repository
```

And for reversing common actions:

```text
git restore --staged file
    ↓
Staging Area → Working Directory

git restore file
    ↓
Discard uncommitted Working Directory changes

git rm --cached file
    ↓
Remove file from Git tracking
Keep file locally
```

The most important concept is to understand the difference between **Working Directory, Staging Area, Local Repository, and Remote Repository**. Once this flow is clear, most basic Git commands become much easier to understand.
