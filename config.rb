relative_assets = true

sourcemap = true

# Make a copy of sprites with a name that has no uniqueness of the hash.
on_sprite_saved do |filename|
  if File.exists?(filename)
    FileUtils.cp filename, filename.gsub(%r{-s[a-z0-9]{10}\.png$}, '-sprite.png').gsub(%r{/_}, '/')
    FileUtils.rm filename
  end
end

