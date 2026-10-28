import importlib.util,json,sys,tempfile,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'scripts'))
import community_sources as c
class CommunitySources(unittest.TestCase):
 def test_explicit_dates_and_unknown_ends(self):
  for label,expected in [('2025年8月1日-3日',('2025-08-01','2025-08-03')),('2025年8月1日-9月下旬',('2025-08-01',None)),('2026年1月1日-长期招募',('2026-01-01',None)),('February 28 – March 2, 2027',(None,None)),('November 9-12, 2026',('2026-11-09','2026-11-12')),('November 9, 2026 – November 12, 2026',('2026-11-09','2026-11-12'))]:self.assertEqual(c.date_range(label),expected)
  with self.assertRaises(ValueError):c.date_range('2025年8月3日-1日')
 def test_html_metadata_and_fail_closed(self):
  html='<p>Displaying 1 events</p><article id="post-1" class="callout"><h4><a href="https://example.org/">A &amp; B</a></h4><span class="date">November 9, 2026</span><span class="virtual">Virtual</span></article>'
  r=c.parse_lf(html,'https://events.linuxfoundation.org/about/calendar/','calendar')[0];self.assertEqual(r['title'],'A & B');self.assertEqual(r['location'],'Virtual')
  for bad in [html.replace('Displaying 1','Displaying 2'),html.replace('https://example.org/','javascript:alert(1)'),html.replace('class="date"','class="unknown"')]:
   with self.assertRaises((AssertionError,ValueError)):c.parse_lf(bad,'https://events.linuxfoundation.org/about/calendar/','calendar')
 def test_provenance_dates_and_no_virtual_coordinates(self):
  rows,sources=c.build_community(ROOT);self.assertGreater(len(rows),0);self.assertEqual(len(rows),len({r['id'] for r in rows}))
  for r in rows:
   if r['mode']!='in-person':self.assertIsNone(r['point'])
   self.assertTrue(r['sourcePages']);self.assertIsNone(r['rank'])
  record=dict(sourceId='example',title='实习招募',url='https://example.org',dateLabel='2026年1月1日-长期招募',location='线上',locationConflict=True,sourceFile='data/activities.yml',timezone='Asia/Shanghai',timeline=[dict(comment='报名截止',deadline='2026-01-02T24:00:00')]);source=dict(id='osd',name='Example',url='https://example.org',sourceCommit='abc',capturedAt='2026-10-28')
  result=c.normalize(record,source,{})
  self.assertEqual(result['milestones'][0]['at'],'2026-01-02T24:00:00');self.assertEqual(result['startsAt'],'2026-01-01');self.assertEqual(result['warnings'],['end-unconfirmed','location-conflict'])
 def test_rollback_keeps_source_and_generated_bundle(self):
  spec=importlib.util.spec_from_file_location('refresh',ROOT/'scripts/refresh-community.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp);(root/'public/data').mkdir(parents=True);(root/'source.json').write_bytes(b'old source');(root/'public/data/conferences.json').write_bytes(b'old catalog')
   def fail():raise ValueError('invalid new data')
   with self.assertRaises(ValueError):module.write_validated(root,{'source.json':b'new source'},fail)
   self.assertEqual((root/'source.json').read_bytes(),b'old source');self.assertEqual((root/'public/data/conferences.json').read_bytes(),b'old catalog')
if __name__=='__main__':unittest.main()
