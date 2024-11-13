use std::path::PathBuf;

pub struct NixPath{
    given_path: PathBuf,
    root_path: PathBuf,
}

impl NixPath{
    pub fn new(given_path: PathBuf, root_path: PathBuf) -> Self{
        Self{given_path, root_path}
    }

    pub fn resolve(&self) -> PathBuf{
        let resolved_path = self.given_path.strip_prefix(&self.root_path).unwrap().to_path_buf();
        let mut resolved_path_with_at = PathBuf::from("@");
        resolved_path_with_at.push(resolved_path);
        resolved_path_with_at
    }
}
