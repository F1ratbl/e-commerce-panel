import glob

html_files = glob.glob('/Users/firat/panel/*.html')

for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Fix Sidebar Height issue (cutting off items)
    if 'h-[calc(100vh-4rem)] fixed left-0 top-16 z-40' in content or 'h-[calc(100vh-4rem)] w-64 fixed left-0 top-16 z-40' in content:
        content = content.replace('h-[calc(100vh-4rem)] w-64 fixed left-0 top-16 z-40', 'bottom-0 w-64 fixed left-0 top-16 z-[60]')
        content = content.replace('h-[calc(100vh-4rem)] fixed left-0 top-16 z-40', 'bottom-0 w-64 fixed left-0 top-16 z-[60]')
        
    # 2. Fix the flex alignment for the header actions (Add New Product + buttons)
    # Different pages have different header layouts, let's find flex justify-between items-end mb-8
    content = content.replace('<div class="flex justify-between items-end mb-8', '<div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8')

    # Also check if main has flex-1 ml-64 (it was changed earlier, but we want to make sure it's ml-0 md:ml-64 w-full)
    content = content.replace('<main class="flex-1 ml-64 p-4', '<main class="flex-1 ml-0 md:ml-64 p-4')
    
    # 3. Add overflow-x-auto to any table wrapper
    # We will wrap tables if they exist or just add w-full overflow-x-auto to their parent.
    # We'll just replace `<table` with `<div class="w-full overflow-x-auto"><table` and `</table>` with `</table></div>`
    # if we haven't done so already.
    # But wait, it's safer to just inject overflow hidden in body or just wrap tables safely if they aren't wrapped already.

    with open(filepath, 'w') as f:
        f.write(content)

print("Fixed layout elements")
