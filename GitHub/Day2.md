1. Git Reset

git reset is used to move the current branch's HEAD to another commit. Depending on the reset mode, it can also modify the staging area and working directory.

Common reset modes are:

git reset --soft
git reset --mixed
git reset --hard

For practical usage, the most important modes are soft reset and hard reset.

1.1 Soft Reset

A soft reset moves HEAD to an earlier commit while keeping the changes from the commits being removed in the staging area.

Example

Suppose the history is:

A --- B --- C --- D
              ^
             HEAD

Run:

git reset --soft B

The result is:

A --- B
      ^
     HEAD

Changes from C and D
        |
        v
   Staging Area

The commits C and D are removed from the current branch history, but their changes remain staged.

Check the status:

git status

You can then create a new commit:

git commit -m "Combine previous changes"

When to use soft reset

Soft reset is useful when:

You want to combine multiple local commits.

You want to modify the last few commits.

You want to clean up local commit history.

The commits have not been shared with other developers.

Example:

git reset --soft HEAD~3

This moves HEAD back by three commits while keeping the changes staged.

1.2 Hard Reset

A hard reset moves HEAD, resets the staging area, and resets tracked files in the working directory to the selected commit.

Example

Current history:

A --- B --- C --- D
                  ^
                 HEAD

Run:

git reset --hard B

Result:

A --- B
      ^
     HEAD

The changes introduced by C and D are removed from the working directory and staging area.

Important Warning

Be careful with:

git reset --hard HEAD

This discards uncommitted changes to tracked files.

git reset --hard does not normally remove untracked files.

Soft Reset vs Hard Reset

Feature

Soft Reset

Hard Reset

Moves HEAD

Yes

Yes

Keeps working-directory changes

Yes

No

Keeps changes staged

Yes

No

Useful for combining commits

Yes

No

Risk of losing uncommitted changes

Low

High

2. Git Revert

git revert is used to undo the changes introduced by a previous commit.

Unlike git reset, revert does not remove the original commit. Instead, Git creates a new commit that reverses the changes.

Example

Original history:

A --- B --- C
            ^
           HEAD

Suppose commit C introduced an unwanted change.

Run:

git revert C

Git creates a new commit:

A --- B --- C --- R
                  ^
                 HEAD

Where:

R = Revert commit

The original commit C remains in the history, while R reverses its changes.

Using a commit ID

First view the history:

git log --oneline

Example:

8f31c9d Add payment functionality
72ab45e Update login page
45cd812 Initial project setup

To undo the first commit:

git revert 8f31c9d

Git creates a new commit that reverses the changes introduced by 8f31c9d.

You can then push the revert:

git push origin main

When to use revert

Use git revert when:

A commit has already been pushed.

Other developers may already have pulled the commit.

You need to undo a change without rewriting shared history.

3. Git Reset vs Git Revert

The main difference is how they handle Git history.

Reset

git reset moves the branch pointer to another commit and can rewrite local history.

Before:

A --- B --- C
            ^
           HEAD

After:

A --- B
      ^
     HEAD

Revert

git revert keeps the original commit and adds a new commit that reverses it.

Before:

A --- B --- C
            ^
           HEAD

After:

A --- B --- C --- R
                  ^
                 HEAD

Comparison

Feature

Reset

Revert

Creates a new commit

No

Yes

Changes existing history

Yes

No

Suitable for shared branches

Generally avoid

Yes

Useful for local commits

Yes

Yes

Can discard changes

Yes, with --hard

No

Typical purpose

Clean up local history

Safely undo shared changes

Practical Rule

Local / private branch
        |
        v
      RESET

Shared / public branch
        |
        v
      REVERT

4. Squash Commit

Squashing means combining multiple commits into a single commit.

It is commonly used to clean up a feature branch before merging it into main.

Example

Suppose your branch contains:

A --- B --- C --- D --- E
              |     |     |
            Add   Fix   Update

You want to combine C, D, and E into one commit:

A --- B --- F
          |
    Feature complete

Interactive Rebase

To squash the last three commits:

git rebase -i HEAD~3

Git opens an editor containing something similar to:

pick abc1234 Add login page
pick def5678 Fix login page
pick ghi9012 Update login validation

Change it to:

pick abc1234 Add login page
squash def5678 Fix login page
squash ghi9012 Update login validation

Save and exit.

Git will combine the commits and ask for the final commit message.

For example:

Add login functionality

Result

Before:

abc1234 Add login page
def5678 Fix login page
ghi9012 Update login validation

After:

xyz7890 Add login functionality

Important

Interactive rebase rewrites commit history.

Use it carefully on branches that have already been shared.

5. Git Cherry-Pick

git cherry-pick applies the changes introduced by a specific commit to the current branch.

It is useful when you need one particular change from another branch without merging the entire branch.

Example

Suppose:

main:
A --- B --- C

feature:
A --- B --- D --- E

Suppose commit D contains an important bug fix that is required in main.

Switch to main:

git switch main

Find the commit:

git log feature --oneline

Example:

e45f789 Fix production configuration
a12bc34 Add new feature

Apply the required commit:

git cherry-pick e45f789

The result is:

main:

A --- B --- C --- D'

D' contains the changes from D, but it is a new commit with a different commit ID.

Common use case

A feature branch contains many commits, but only one specific bug fix is required in another branch.

Instead of merging the entire feature branch:

git cherry-pick <commit-id>

6. Git Rebase

git rebase takes commits from the current branch and replays them on top of another branch.

It is commonly used to update a feature branch with the latest changes from main.

Example

Initial state:

A --- B --- C
       \
        D --- E

Here:

main:    A --- B --- C
feature:      D --- E

Switch to the feature branch:

git switch feature

Rebase it on main:

git rebase main

Git replays the feature commits on top of C.

Result:

A --- B --- C --- D' --- E'

The new commits have different commit IDs because Git recreated them on the new base.

Typical Workflow

git switch feature/my-feature
git fetch origin
git rebase origin/main

If a conflict occurs:

git status

Resolve the conflict, then:

git add <file>
git rebase --continue

To cancel the rebase:

git rebase --abort

Important

Avoid rebasing a branch that other developers are actively using unless the team has agreed to rewrite that branch's history.

After rebasing an already-pushed branch, you may need:

git push --force-with-lease

--force-with-lease is generally safer than:

git push --force

7. Git Merge

git merge combines the changes from one branch into another branch.

Example

Suppose:

main:

A --- B --- C
       \
        D --- E

Switch to main:

git switch main

Merge the feature branch:

git merge feature

The result may be:

A --- B --- C ------- M
       \             /
        D --- E ----

Where:

M = Merge commit

The branch histories are preserved.

Fast-Forward Merge

If main has not changed since the feature branch was created, Git may perform a fast-forward merge.

Before:

A --- B --- C
             \
              D

After:

A --- B --- C --- D

No separate merge commit is required.

8. Rebase vs Merge

Both rebase and merge integrate changes from different branches, but they produce different histories.

Merge

A --- B --- C ------- M
       \             /
        D --- E ----

The branch history is preserved.

Rebase

A --- B --- C --- D' --- E'

The feature commits are replayed on top of the latest base.

Comparison

Feature

Merge

Rebase

Preserves branch history

Yes

No

Creates merge commit

Sometimes

No

Changes commit IDs

No

Yes

Produces linear history

Not necessarily

Usually

Suitable for shared branches

Yes

Use carefully

Useful for updating feature branches

Yes

Yes

Rewrites history

No

Yes

When to Use Merge

Use merge when:

The branch is shared by multiple developers.

You want to preserve branch history.

You are integrating a completed feature.

You do not want to rewrite existing commits.

Example:

git switch main
git merge feature/login

When to Use Rebase

Use rebase when:

You are working on your own feature branch.

You want a cleaner, linear history.

You want to update your feature branch with the latest main.

The commits have not been shared or the team has agreed to the history rewrite.

Example:

git switch feature/login
git rebase main

Practical Rule

Personal / local feature branch
             |
             v
           REBASE

Shared / public branch
             |
             v
            MERGE

GitHub Repository Management

9. Repository Creation

A GitHub repository is a central location for source code, documentation, issues, pull requests, workflows, and project configuration.

Create a Repository

Typical steps:

Open GitHub.

Select New repository.

Enter the repository name.

Select the repository visibility:

Public

Private

Optionally add a README.

Optionally select a .gitignore template.

Create the repository.

Connect an Existing Local Repository

git remote add origin git@github.com:USERNAME/REPOSITORY.git

Verify:

git remote -v

Push the branch:

git push -u origin main

10. Teams and Repository Permissions

For GitHub organizations, teams can be used to manage repository access for groups of users.

Example:

DevOps Team
    |
    +-- Developer 1
    +-- Developer 2
    +-- Developer 3

Instead of assigning repository permissions individually, access can be granted to the team.

Common GitHub repository permission levels include:

Read
Triage
Write
Maintain
Admin

Example

A repository might have:

Developers Team  -> Write
QA Team          -> Triage
Platform Team    -> Maintain
Administrators   -> Admin

The exact access model should follow the organization's security and least-privilege requirements.

11. Branch Protection / Branch Rules

Branch protection helps prevent accidental or unauthorized changes to important branches such as:

main
production
release/*

Typical branch rules can require:

Pull requests before merging

One or more approvals

Successful CI checks

Resolved conversations

Restrictions on direct pushes

Restrictions on force pushes

Restrictions on branch deletion

Signed commits, where required

Example Workflow

Developer
    |
    v
feature/login
    |
    | Pull Request
    v
main
    |
    +-- Code Review
    +-- CI Checks
    +-- Approval
    +-- Merge

For current GitHub repositories, administrators may configure these controls through Rulesets as well as traditional branch protection settings.

12. CODEOWNERS

CODEOWNERS defines which users or teams are responsible for reviewing changes to specific parts of a repository.

A common location is:

.github/CODEOWNERS

Example Repository

.github/
    CODEOWNERS

application/
infrastructure/
kubernetes/

Example CODEOWNERS:

# Application changes
/application/ @dev-team

# Infrastructure changes
/infrastructure/ @platform-team

# Kubernetes changes
/kubernetes/ @devops-team

When a pull request modifies a file under:

kubernetes/

GitHub can automatically request review from:

@devops-team

Benefits

Automatic reviewer assignment

Clear ownership

Consistent code review

Better control over sensitive areas

Easier collaboration in larger teams

SSH Key Setup

13. What is SSH Authentication?

SSH authentication allows Git to communicate with GitHub using an SSH key pair.

The key pair consists of:

Private Key
     +
Public Key

A typical Ed25519 key pair is:

~/.ssh/id_ed25519
~/.ssh/id_ed25519.pub

Security Rule

Private key -> Keep secret
Public key  -> Add to GitHub

Never share the private key.

14. Generate an SSH Key

On Linux:

ssh-keygen -t ed25519 -C "your-email@example.com"

Accept the default file location if appropriate:

/home/dinesh/.ssh/id_ed25519

Start the SSH agent:

eval "$(ssh-agent -s)"

Add the private key:

ssh-add ~/.ssh/id_ed25519

Display the public key:

cat ~/.ssh/id_ed25519.pub

Copy the complete output.

15. Add the SSH Key to GitHub

In GitHub:

Profile Picture
      |
      v
Settings
      |
      v
SSH and GPG keys
      |
      v
New SSH key

Enter:

Title: My Linux Machine
Type: Authentication Key
Key: <paste public key>

Save the key.

Test the connection:

ssh -T git@github.com

A successful authentication will produce a confirmation from GitHub.

16. Clone a Repository Using SSH

HTTPS cloning:

git clone https://github.com/USERNAME/REPOSITORY.git

SSH cloning:

git clone git@github.com:USERNAME/REPOSITORY.git

Example:

git clone git@github.com:dinesh777-dg/Devops-Learning.git

Then:

cd Devops-Learning

Verify the remote:

git remote -v

Expected output:

origin  git@github.com:dinesh777-dg/Devops-Learning.git (fetch)
origin  git@github.com:dinesh777-dg/Devops-Learning.git (push)

Webhooks

17. What is a Webhook?

A webhook is a mechanism that allows one application to automatically send information to another application when a specific event occurs.

The basic flow is:

Event Occurs
     |
     v
GitHub
     |
     | HTTP Request
     v
Webhook Endpoint
     |
     v
External Application

For example, when a developer pushes code:

Developer
    |
    | git push
    v
GitHub Repository
    |
    | Webhook
    v
CI/CD System
    |
    v
Build / Test / Deploy

18. How GitHub Webhooks Work

Suppose a webhook is configured for the push event.

A developer runs:

git push origin main

GitHub detects the push event and sends an HTTP request to the configured webhook endpoint.

The receiving application processes the event.

Example:

GitHub
   |
   | POST /webhook
   v
Jenkins
   |
   +-- Checkout code
   +-- Build
   +-- Unit Tests
   +-- Security Scan
   +-- Deployment

19. Common Webhook Uses

CI/CD

A webhook can trigger a CI/CD pipeline after a Git push.

Git Push
   |
   v
GitHub
   |
   v
Webhook
   |
   v
Jenkins / CI System
   |
   v
Build
   |
   v
Test
   |
   v
Deploy

Notifications

Webhooks can send notifications when repository events occur.

Example:

Pull Request Created
        |
        v
      GitHub
        |
        v
     Webhook
        |
        v
Slack / Teams / Notification System

Third-Party Integrations

Webhooks can integrate GitHub with:

Jenkins

CI/CD platforms

Chat and notification systems

ITSM systems

Monitoring platforms

Automation platforms

Custom applications

20. Webhook Example

Consider a CI/CD workflow:

Developer
    |
    | git push
    v
GitHub Repository
    |
    | Webhook
    v
Jenkins
    |
    +-- Checkout
    +-- Build
    +-- Test
    +-- Security Scan
    +-- Deploy

The developer only needs to push the code:

git push origin main

The configured webhook can automatically notify Jenkins and trigger the pipeline.

Quick Interview Revision

Git Reset

git reset moves the current branch's HEAD to another commit and can modify the staging area and working directory depending on the reset mode. A soft reset keeps changes staged, while a hard reset resets tracked files to the target commit and can discard local changes.

git reset --soft HEAD~1
git reset --hard HEAD~1

Git Revert

git revert creates a new commit that reverses the changes introduced by an earlier commit. The original commit remains in the history.

git revert <commit-id>

Reset vs Revert

Reset
  -> Rewrites or moves local history
  -> Mainly used for local/private commits

Revert
  -> Creates an inverse commit
  -> Suitable for shared history

Squash

Squashing combines multiple commits into a single commit to produce a cleaner and more meaningful history.

git rebase -i HEAD~3

Cherry-Pick

Cherry-pick applies the changes from a specific commit to the current branch without merging the complete source branch.

git cherry-pick <commit-id>

Rebase

Rebase replays commits from one branch on top of another base commit. It is commonly used to keep a feature branch current with main and maintain a linear history.

git switch feature/login
git rebase main

Merge

Merge integrates the changes from one branch into another while preserving the branch histories.

git switch main
git merge feature/login

Rebase vs Merge

MERGE

A --- B --- C ------- M
       \             /
        D --- E ----


REBASE

A --- B --- C --- D' --- E'

Overall Git Workflow

                         Git Workflow

                    Working Directory
                           |
                           | git add
                           v
                     Staging Area
                           |
                           | git commit
                           v
                      Local Repo
                           |
                           | git push
                           v
                     Remote Repo
                           |
                           v
                         GitHub
                           |
            +--------------+--------------+
            |              |              |
         Branches       Pull Requests   Webhooks
            |              |              |
            |              |              v
            |              |            CI/CD
            |              |
            |              v
            |          Code Review
            |
            +-- Merge
            +-- Rebase
            +-- Cherry-pick
            +-- Squash

Essential Git Commands

# Check repository status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Commit message"

# View detailed history
git log

# View compact history
git log --oneline

# Unstage a file
git restore --staged <file>

# Discard working-directory changes
git restore <file>

# Soft reset
git reset --soft HEAD~1

# Hard reset
git reset --hard HEAD~1

# Revert a commit
git revert <commit-id>

# Cherry-pick a commit
git cherry-pick <commit-id>

# Rebase feature branch
git rebase main

# Merge feature branch
git merge feature

# Push changes
git push origin <branch>

# Pull latest changes
git pull origin main

# View configured remotes
git remote -v
