from typing import List
from datetime import datetime, timezone
import math
from models import Post, AudienceSegmentRequest

def rank_trending_feed(posts: List[Post]) -> List[Post]:
    """
    Ranks a feed of posts using a HackerNews-style time decay algorithm
    factoring in the momentum score.
    """
    now = datetime.now(timezone.utc)
    
    def calculate_decay_score(post: Post) -> float:
        # Time difference in hours
        delta_hours = (now - post.time_posted).total_seconds() / 3600.0
        if delta_hours < 0:
            delta_hours = 0
            
        # Base score is momentum_score + total engagements
        base_score = post.momentum_score * 10 + post.likes + (post.comments_count * 2)
        
        # Gravity formula: Score / (Age in hours + 2)^Gravity
        gravity = 1.8 # High gravity = older posts drop off very quickly
        return base_score / math.pow(delta_hours + 2, gravity)
    
    ranked_posts = sorted(posts, key=calculate_decay_score, reverse=True)
    return ranked_posts

def rank_for_you_feed(request: AudienceSegmentRequest, posts: List[Post]) -> List[Post]:
    """
    Personalized ranking based on user's preferred tags (audience segmentation).
    Content matching preferred tags gets a massive multiplier.
    """
    preferred_set = set(request.preferred_tags)
    
    def calculate_personal_score(post: Post) -> float:
        post_tags = set(post.tags)
        match_count = len(preferred_set.intersection(post_tags))
        
        # Multiplier scales exponentially with number of matching tags
        tag_multiplier = 1.0 + (math.pow(match_count, 1.5) * 0.5)
        
        # Base popularity is still considered so they get good content
        base_quality = post.momentum_score + (post.likes * 0.1)
        
        return base_quality * tag_multiplier
        
    ranked_posts = sorted(posts, key=calculate_personal_score, reverse=True)
    return ranked_posts
