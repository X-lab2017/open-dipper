import importlib.util, tempfile, unittest, json
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('ic',Path(__file__).parents[1]/'scripts/collect-intelligence.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Tests(unittest.TestCase):
 def test_date_and_link(self):
  self.assertIsNone(m.date('not a date'));self.assertIsNone(m.url('javascript:alert(1)'));self.assertEqual(m.date('2026-10-20T01:02:03Z'),'2026-10-20')
 def test_feed_metadata(self):
  rows=m.parse('blog',b'<rss><channel><item><title>Hello</title><link>https://example.org/a</link><pubDate>Tue, 20 Oct 2026 00:00:00 GMT</pubDate></item></channel></rss>');self.assertEqual(rows[0][0],'Hello')
 def test_failed_sources_retain_last_good_and_clock(self):
  with tempfile.TemporaryDirectory() as d:
   path=Path(d)/'cache.json';old={'records':[{'sourceId':'hf-blog','url':'https://example.org/a','date':'2026-10-01','captured':'2026-10-02'}],'health':[]};path.write_text(json.dumps(old))
   with patch.object(m,'OUT',path),patch.object(m.urllib.request,'urlopen',side_effect=TimeoutError('offline')):m.collect()
   result=json.loads(path.read_text());self.assertEqual(result['records'],old['records']);self.assertTrue(all(h['status']=='unavailable' for h in result['health']))
 def test_daily_papers(self):
  rows=m.parse('daily',json.dumps([{'paper':{'id':'2610.12345','title':'Example','publishedAt':'2026-10-20'}}]));self.assertEqual(rows[0][2],'https://arxiv.org/abs/2610.12345')
