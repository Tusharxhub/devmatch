-- Function to increment likes count
CREATE OR REPLACE FUNCTION increment_likes(project_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE projects 
  SET likes_count = likes_count + 1 
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement likes count
CREATE OR REPLACE FUNCTION decrement_likes(project_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE projects 
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update project collaborator count
CREATE OR REPLACE FUNCTION update_collaborator_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects 
    SET current_collaborators = current_collaborators + 1 
    WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects 
    SET current_collaborators = GREATEST(current_collaborators - 1, 0)
    WHERE id = OLD.project_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for project collaborators
CREATE TRIGGER update_project_collaborator_count
  AFTER INSERT OR DELETE ON project_collaborators
  FOR EACH ROW EXECUTE FUNCTION update_collaborator_count();
