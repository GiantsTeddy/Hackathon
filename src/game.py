import pygame
import sys

# Initialize Pygame
pygame.init()

# Constants
WIDTH, HEIGHT = 800, 600
BG_COLOR = (100, 200, 100)  # Green background for grass field
PLAYER_COLOR = (255, 0, 0)  # Red player
ITEM_COLOR = (0, 0, 255)    # Blue item

# Set up display
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Simple Simulator Game")

# Player settings
player_size = 40
player_pos = [WIDTH // 2, HEIGHT // 2]
player_speed = 5

# Item settings
item_size = 20
item_pos = [100, 100]
items_collected = 0

# Font settings
font = pygame.font.SysFont(None, 36)

def draw_player(position):
    pygame.draw.rect(screen, PLAYER_COLOR, (*position, player_size, player_size))

def draw_item(position):
    pygame.draw.rect(screen, ITEM_COLOR, (*position, item_size, item_size))

def draw_gui():
    text = font.render(f"Items Collected: {items_collected}", True, (0, 0, 0))
    screen.blit(text, (10, 10))

def handle_movement(keys):
    global player_pos
    if keys[pygame.K_LEFT]:
        player_pos[0] -= player_speed
    if keys[pygame.K_RIGHT]:
        player_pos[0] += player_speed
    if keys[pygame.K_UP]:
        player_pos[1] -= player_speed
    if keys[pygame.K_DOWN]:
        player_pos[1] += player_speed

def check_collision():
    global items_collected, item_pos
    player_rect = pygame.Rect(*player_pos, player_size, player_size)
    item_rect = pygame.Rect(*item_pos, item_size, item_size)
    if player_rect.colliderect(item_rect):
        items_collected += 1
        item_pos = [random.randint(0, WIDTH - item_size), random.randint(0, HEIGHT - item_size)]

# Game loop
while True:
    screen.fill(BG_COLOR)
    
    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
    
    # Key presses
    keys = pygame.key.get_pressed()
    handle_movement(keys)
    
    # Drawing
    draw_player(player_pos)
    draw_item(item_pos)
    draw_gui()
    
    # Check collisions
    check_collision()
    
    # Update display
    pygame.display.flip()

    # Frame rate
    pygame.time.Clock().tick(30)
